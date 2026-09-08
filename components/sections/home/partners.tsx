import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const partners = [
  { name: "Elevatus", src: "/assets/partners/p1.svg" },
  { name: "Konnect Insights", src: "/assets/partners/p2.svg" },
  { name: "aspect", src: "/assets/partners/p3.svg" },
  { name: "AVAYA", src: "/assets/partners/p4.svg" },
  { name: "DXRepublic", src: "/assets/partners/p5.svg" },
  { name: "Dion", src: "/assets/partners/p6.svg" },
  { name: "Dubai Technologies", src: "/assets/partners/p7.svg" },
  { name: "Ducont", src: "/assets/partners/p8.svg" },
];

function LogoPill({ name, src }: { name: string; src: string }) {
  return (
    <div className="shiny-chip shrink-0 mx-sm">
      <div className="shiny-chip__inner w-[165px] flex items-center justify-center px-2xl py-lg">
        <Image
          src={src}
          alt={name}
          width={85}
          height={45}
          decoding="async"
          className="h-[45px] w-auto w-full object-contain"
        />
      </div>
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
        @property --chip-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .shiny-chip {
          position: relative;
          border-radius: 9999px;
          padding: 1px;                       /* ring thickness */
          background: rgba(255, 255, 255, 0.08); /* base ring (fallback) */
          isolation: isolate;
        }
        .shiny-chip::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;                       /* same as ring thickness */
          background: conic-gradient(
            from var(--chip-angle),
            rgba(255, 255, 255, 0.08) 0deg,
            rgba(255, 255, 255, 0.08) 200deg,
            rgba(255, 255, 255, 0.95) 280deg,
            rgba(255, 255, 255, 0.08) 360deg
          );
          /* show only the 1px ring, not the fill */
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: chip-spin 3.5s linear infinite;
          z-index: -1;
        }
        .shiny-chip__inner {
          border-radius: inherit;
          background: rgba(255, 255, 255, 0.04);
        }

        @keyframes chip-spin {
          to { --chip-angle: 360deg; }
        }

        .marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 2%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
        }
        .marquee-track { display: flex; width: max-content; }
        .marquee-track--left { animation: marquee-left 30s linear infinite; }
        .marquee-track--right { animation: marquee-right 30s linear infinite; }
        .marquee-mask:hover .marquee-track { animation-play-state: paused; }

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
          .marquee-track--right,
          .shiny-chip::before {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
