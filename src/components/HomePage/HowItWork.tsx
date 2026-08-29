"use client";

import signupGif from "@/../public/new/signup.webp";
import trophy from "@/../public/new/trophy-dark.webp";
import Image from "next/image";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function StepLabel({ n, green = false }: { n: number; green?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase mb-4"
      style={{
        color: green ? "rgba(47,193,145,0.9)" : "rgba(255,255,255,0.7)",
      }}
    >
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black"
        style={{
          background: green ? "rgba(47,193,145,0.25)" : "rgba(5,54,151,0.4)",
          border: green
            ? "1px solid rgba(47,193,145,0.5)"
            : "1px solid rgba(5,54,151,0.5)",
          color: "#fff",
        }}
      >
        {n}
      </span>
      Step {String(n).padStart(2, "0")}
    </span>
  );
}

/* Card 1 */
function Card1() {
  return (
    <div
      className="group relative rounded-[20px] overflow-hidden h-full "
      style={{
        background: "linear-gradient(145deg, #031c4f 0%, #053697 100%)",
        border: "1px solid rgba(5,54,151,0.35)",
      }}
    >
      <Image
        src={signupGif}
        alt=""
        fill
        className="absolute inset-0 object-cover opacity-25"
        unoptimized
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(3,28,79,0.2) 0%, rgba(5,54,151,0.65) 55%, rgba(3,28,79,0.95) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: NOISE }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        <StepLabel n={1} />
        <div>
          <h2 className="text-xl sm:text-4xl font-bold text-white mb-2">
            Create Your <br /> Fan Profile
          </h2>
          <p className="text-base text-white/70">
            Sign up in seconds and set up your fan profile. Choose the sports
            and athletes you follow so we can make your PROTIPPZ experience more
            personal.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Card 2 */
function Card2() {
  return (
    <div
      className="group w-full relative rounded-[20px] overflow-hidden h-full"
      style={{
        background: "linear-gradient(145deg, #093c2d 0%, #2FC191 100%)",
        border: "1px solid rgba(47,193,145,0.35)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: NOISE }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        <StepLabel n={2} green />
        <div>
          <h2 className="text-xl sm:text-4xl font-bold text-white mb-2">
            Discover <br /> Athletes
          </h2>
          <p className="text-base text-white/80 mb-4">
            Explore talented athletes across different sports, leagues, and
            competitions. Find the players you love, follow their journey, and
            show your support along the way.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Card 3 */
function Card3() {
  return (
    <div
      className="group relative rounded-[20px] overflow-hidden h-full"
      style={{
        background: "linear-gradient(145deg, #2FC191 0%, #093c2d 100%)",
        border: "1px solid rgba(47,193,145,0.35)",
      }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row h-full">
        <div className="flex flex-col justify-between p-6 flex-1">
          <StepLabel n={3} green />

          <div>
            <h2 className="text-xl sm:text-4xl font-bold text-white mb-3">
              Send a <br />
              <span className="text-white">Real-Time Tip</span>
            </h2>

            <p className="text-base text-white/80 mb-4">
              Show your support when it matters most during a game, tournament,
              or standout moment. Send a tip through PROTIPPZ and let your
              favourite athletes know you’re behind them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Card 4 */
function Card4() {
  return (
    <div className="group relative h-full flex flex-col">
      <div className="relative z-20 flex justify-center -mb-6">
        <Image src={trophy} alt="trophy" width={70} height={70} />
      </div>

      <div
        className="relative flex-1 rounded-[20px] overflow-hidden p-6"
        style={{
          background: "linear-gradient(145deg, #053697 0%, #031c4f 100%)",
          border: "1px solid rgba(5,54,151,0.35)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: NOISE }}
        />

        <StepLabel n={4} />

        <h2 className="text-xl sm:text-4xl font-bold text-white mb-2">
          Unlock Fan Rewards
        </h2>

        <p className="text-base text-white/70">
          Every tip you send earns points and brings you closer to exclusive fan
          rewards from merchandise and meet-and-greets to VIP experiences.
        </p>
      </div>
    </div>
  );
}

/* Main Section */
export default function HowItWork() {
  return (
    <section className="relative w-full py-12">
      <div className="max-w-355 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border"
            style={{
              background: "rgba(47,193,145,0.06)",
              borderColor: "rgba(47,193,145,0.22)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2FC191]">
              How it works
            </span>
          </div>
          <h1 className="text-2xl font-e sm:text-4xl md:text-5xl font-bold text-[#053697] mb-4">
            Start supporting athletes in 4{" "}
            <span className="text-[#2FC191]">simple steps</span>
          </h1>

          <p className="text-black/40 max-w-2xl mx-auto">
            Follow our simple guide to support your favorite female athletes,
            earn rewards, and be part of the movement changing women&apos;s
            sports.
          </p>
        </div>

        {/* Responsive Bento Grid */}
        <div
          className="grid gap-3
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3"
        >
          <div className="col-span-3 sm:col-span-1">
            <Card1 />
          </div>

          <div className="col-span-3 sm:col-span-2 lg:col-span-2">
            <Card2 />
          </div>

          <div className="col-span-3 sm:col-span-2 lg:col-span-2">
            <Card3 />
          </div>

          <div className="col-span-3 sm:col-span-3 lg:col-span-1">
            <Card4 />
          </div>
        </div>
      </div>
    </section>
  );
}
