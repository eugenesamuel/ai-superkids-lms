"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Link as LinkIcon, MessageSquare, HelpCircle } from "lucide-react";
import type { Activity } from "@/lib/types";
import { QuizOption } from "./QuizOption";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function ActivityCard({
  activity,
  onSubmit,
}: {
  activity: Activity;
  onSubmit?: (data: unknown) => void;
}) {
  if (activity.type === "quiz") return <QuizActivity activity={activity} onSubmit={onSubmit} />;
  if (activity.type === "upload") return <UploadActivity activity={activity} onSubmit={onSubmit} />;
  if (activity.type === "text") return <TextActivity activity={activity} onSubmit={onSubmit} />;
  if (activity.type === "link") return <LinkActivity activity={activity} onSubmit={onSubmit} />;
  return null;
}

function Header({ activity, icon: Icon }: { activity: Activity; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="grid place-items-center w-10 h-10 rounded-full bg-ds-orange/15 text-ds-orange">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="font-display text-xl text-space-navy leading-tight">{activity.title}</p>
        <p className="text-sm text-space-navy/70">{activity.prompt}</p>
      </div>
    </div>
  );
}

function QuizActivity({ activity, onSubmit }: { activity: Activity; onSubmit?: (d: unknown) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = activity.quiz?.correctIndex ?? -1;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-space-navy/5">
      <Header activity={activity} icon={HelpCircle} />
      <p className="font-display text-lg text-space-navy mb-4">{activity.quiz?.question}</p>
      <div className="grid gap-3">
        {activity.quiz?.options.map((opt, i) => {
          const state = picked === null ? "idle" : picked === i ? (i === correct ? "correct" : "wrong") : i === correct && picked !== correct ? "correct" : "idle";
          return (
            <QuizOption
              key={i}
              option={opt}
              index={i}
              state={state}
              disabled={picked !== null && picked === correct}
              onPick={() => {
                setPicked(i);
                if (i === correct) onSubmit?.({ choice: i, correct: true });
              }}
            />
          );
        })}
      </div>
      {picked !== null && picked !== correct && (
        <p className="mt-4 text-sm text-space-navy/70 text-center font-body">
          Hmm not quite — try another! You've got this 💪
        </p>
      )}
    </div>
  );
}

function UploadActivity({ activity, onSubmit }: { activity: Activity; onSubmit?: (d: unknown) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-space-navy/5">
      <Header activity={activity} icon={Upload} />
      <label
        htmlFor="upload"
        className={cn(
          "block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
          file ? "border-neon-green bg-neon-green/5" : "border-space-navy/20 hover:border-ds-orange hover:bg-light-orange",
        )}
      >
        <Upload className="w-8 h-8 mx-auto text-ds-orange mb-2" />
        <p className="font-display text-space-navy">
          {file ? `Picked: ${file.name}` : "Drop your screenshot here or tap to pick"}
        </p>
        <p className="text-xs text-space-navy/60 mt-1">PNG or JPG, up to 5 MB</p>
        <input
          id="upload"
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={!file || done}
        onClick={() => {
          setDone(true);
          onSubmit?.({ filename: file?.name });
        }}
        className="mt-4 w-full bg-ds-orange disabled:opacity-50 text-white font-display text-lg py-4 rounded-2xl shadow-glow"
      >
        {done ? "Sent! ⭐" : copy.submitButton}
      </motion.button>
    </div>
  );
}

function TextActivity({ activity, onSubmit }: { activity: Activity; onSubmit?: (d: unknown) => void }) {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-space-navy/5">
      <Header activity={activity} icon={MessageSquare} />
      <textarea
        rows={5}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Tell me what you think... 2-3 sentences is perfect!"
        className="w-full rounded-2xl border-2 border-space-navy/10 focus:border-ds-orange outline-none p-4 font-body text-space-navy resize-none"
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2 text-xl">
          {["😀", "😍", "🤔", "🤖", "🚀"].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setVal((v) => v + e)}
              className="hover:scale-125 transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
        <span className="text-xs text-space-navy/50 font-body">{val.length} chars</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={val.trim().length < 5 || done}
        onClick={() => {
          setDone(true);
          onSubmit?.({ text: val });
        }}
        className="mt-4 w-full bg-ds-orange disabled:opacity-50 text-white font-display text-lg py-4 rounded-2xl shadow-glow"
      >
        {done ? "Sent! ⭐" : copy.submitButton}
      </motion.button>
    </div>
  );
}

function LinkActivity({ activity, onSubmit }: { activity: Activity; onSubmit?: (d: unknown) => void }) {
  const [url, setUrl] = useState("");
  const [done, setDone] = useState(false);
  const valid = /^https?:\/\/.+\..+/.test(url.trim());
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-space-navy/5">
      <Header activity={activity} icon={LinkIcon} />
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded-2xl border-2 border-space-navy/10 focus:border-ds-orange outline-none p-4 font-body text-space-navy"
        />
        <button
          type="button"
          disabled={!valid}
          className="px-4 rounded-2xl bg-electric-cyan/15 text-electric-cyan disabled:opacity-40 font-display"
        >
          {valid ? "Looks good!" : "Check"}
        </button>
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={!valid || done}
        onClick={() => {
          setDone(true);
          onSubmit?.({ url });
        }}
        className="mt-4 w-full bg-ds-orange disabled:opacity-50 text-white font-display text-lg py-4 rounded-2xl shadow-glow"
      >
        {done ? "Sent! ⭐" : copy.submitButton}
      </motion.button>
    </div>
  );
}
