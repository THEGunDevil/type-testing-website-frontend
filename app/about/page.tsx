import Link from "next/link";
import {
  Keyboard,
  Target,
  Timer,
  BarChart3,
  Code2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Challenge Yourself",
    description:
      "Take a timed typing test and see how accurately and quickly you can type.",
  },
  {
    icon: Timer,
    title: "Different Time Modes",
    description:
      "Choose from short or longer challenges and test yourself at your own pace.",
  },
  {
    icon: BarChart3,
    title: "See Your Results",
    description:
      "Check your WPM, raw speed, accuracy, correct characters, incorrect characters, and completed words.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-gray-800 px-5 pt-14 font-jetbrains text-gray-300">
      <section className="mx-auto flex max-w-5xl flex-col items-center py-20">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-700 bg-gray-900 text-amber-700">
              <Keyboard size={32} />
            </div>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-700">
            About TypeType
          </p>

          <h1 className="mt-4 text-4xl font-bold text-gray-200 md:text-6xl">
            Type. Practice. Improve.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            TypeType is a simple typing practice website built to help you
            improve your typing speed and accuracy through focused practice
            and timed challenges.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-amber-700 px-6 py-3 font-bold text-gray-900 transition-colors hover:bg-amber-600"
            >
              Start Typing
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-md border border-gray-600 px-6 py-3 font-bold text-gray-300 transition-colors hover:border-amber-700 hover:text-amber-500"
            >
              Practice
            </Link>
          </div>
        </div>

        {/* What is TypeType */}
        <section className="mt-24 w-full">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
                Why TypeType?
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-200">
                Built for focused typing practice.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Typing faster is useful, but speed alone is not enough.
                TypeType focuses on the balance between speed and accuracy so
                you can gradually become a more confident typist.
              </p>

              <p className="mt-4 leading-7 text-gray-400">
                The interface is intentionally simple. Instead of filling the
                screen with unnecessary elements, TypeType keeps the attention
                on the text, the keyboard, and your performance.
              </p>
            </div>

            <div className="border border-gray-700 bg-gray-900 p-6">
              <div className="flex items-center gap-3">
                <Code2 className="text-amber-700" size={22} />

                <span className="font-bold text-gray-200">
                  Simple by design
                </span>
              </div>

              <div className="mt-6 space-y-4 text-sm text-gray-400">
                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span>Interface</span>
                  <span className="text-gray-300">Minimal</span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span>Focus</span>
                  <span className="text-gray-300">Typing</span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span>Performance</span>
                  <span className="text-gray-300">Speed + Accuracy</span>
                </div>

                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="text-gray-300">Distraction-free</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-24 w-full">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
              What you can do
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-200">
              Practice your way
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="border border-gray-700 bg-gray-900 p-6 transition-colors duration-300 hover:border-amber-700/50"
                >
                  <Icon size={24} className="text-amber-700" />

                  <h3 className="mt-5 text-lg font-bold text-gray-200">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats explanation */}
        <section className="mt-24 w-full border-y border-gray-700 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
              Your performance
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-200">
              More than just a number
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              TypeType calculates your typing performance using several
              measurements. WPM represents your net typing speed, while raw
              speed shows the total typing speed before accuracy is taken into
              account. Accuracy shows how consistently you type correctly.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 pb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
            Ready to type?
          </h2>

          <p className="mt-4 text-gray-400">
            Start a challenge and see where your typing takes you.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-amber-700 px-6 py-3 font-bold text-gray-900 transition-colors hover:bg-amber-600"
          >
            Start Typing
            <ArrowRight size={18} />
          </Link>
        </section>
      </section>
    </main>
  );
}