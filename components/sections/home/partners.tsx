const partners = [
  { name: "Elevatus", className: "text-lime-400" },
  { name: "Konnect Insights", className: "text-orange-400" },
  { name: "aspect", className: "text-white" },
  { name: "AVAYA", className: "text-teal-300" },
  { name: "DXRepublic", className: "text-red-400" },
  { name: "Dion", className: "text-red-300" },
  { name: "Dubai Technologies", className: "text-blue-300" },
  { name: "Ducont", className: "text-amber-500" },
];

import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

function LogoPill({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center justify-center shrink-0 rounded-full border border-white/10 bg-white/5 px-2xl py-lg mx-sm">
      <span className={`heading-xs-medium tracking-wide ${className}`}>
        {name}
      </span>
    </div>
  );
}

export default function Partners() {
  const track = [...partners, ...partners];

  return (
    <section className="bg-ink py-30 overflow-hidden">
      <Stagger
        as="div"
        className="container max-w-360 px-6 lg-px-10 text-center"
        stagger={0.14}
        amount={0.4}
      >
        <StaggerItem
          as="p"
          className="overline-sm-medium text-slate-400 mb-[18px]"
        >
          Partners
        </StaggerItem>
        <StaggerItem
          as="h2"
          distance={72}
          className="heading-xl-bold text-[36px] text-white max-w-[35ch] mx-auto"
        >
          Clients buy our service. Partners build the platform underneath it.
        </StaggerItem>
        <StaggerItem
          as="p"
          className="body-lg-regular text-slate-300 max-w-[85ch] mx-auto mt-[32px]"
        >
          Each sector page names the operations we already run there, the
          regulatory constraints we work inside, and the client results we can
          put in front of an evaluation committee.
        </StaggerItem>
      </Stagger>

      <Reveal
        className="mt-[60px] flex flex-col gap-lg"
        distance={48}
        blur={false}
        amount={0.2}
      >
        <div className="marquee-mask">
          <div className="marquee-track marquee-track--left">
            {track.map((p, i) => (
              <LogoPill key={`row1-${p.name}-${i}`} {...p} />
            ))}
          </div>
        </div>
        <div className="marquee-mask">
          <div className="marquee-track marquee-track--right">
            {track.map((p, i) => (
              <LogoPill key={`row2-${p.name}-${i}`} {...p} />
            ))}
          </div>
        </div>
      </Reveal>

      <style>{`
        .marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
        }
        .marquee-track {
          display: flex;
          width: max-content;
        }
        .marquee-track--left {
          animation: marquee-left 30s linear infinite;
        }
        .marquee-track--right {
          animation: marquee-right 30s linear infinite;
        }
        .marquee-mask:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track--left,
          .marquee-track--right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
