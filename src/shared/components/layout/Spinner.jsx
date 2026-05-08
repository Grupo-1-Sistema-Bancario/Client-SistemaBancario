
export default function Spinner() {
  return (
    <>
      <style>{`
        .truck { --dur: 3s; display: block; width: 12em; height: auto; }

        .truck__body,
        .truck__line,
        .truck__outside1,
        .truck__outside2,
        .truck__outside3,
        .truck__wheel,
        .truck__wheel-spin,
        .truck__window2 {
          animation: truck-body var(--dur) linear infinite;
        }
        .truck__body        { transform-origin: 17px 11px; }
        .truck__line        { animation-name: truck-line; }
        .truck__outside1    { animation-name: truck-outside1; }
        .truck__outside2    { animation-name: truck-outside2; }
        .truck__outside3    { animation-name: truck-outside3; }
        .truck__window1     { animation-name: truck-window1; }
        .truck__window2     { animation-name: truck-window2; }

        .truck__wheel       { animation-name: truck-wheel; }
        .truck__wheel-spin  {
          animation-name: truck-wheel-spin;
          transform-origin: 6.5px 17px;
        }
        .truck__wheel:nth-child(2) {
          animation-delay: calc(var(--dur) * 0.0625);
        }
        .truck__wheel:nth-child(2) .truck__wheel-spin {
          transform-origin: 27px 17px;
        }

        @keyframes truck-body {
          from, 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%, to {
            animation-timing-function: cubic-bezier(0.33,0,0.67,0);
            transform: translate(0,0) rotate(0);
          }
          6.25%, 18.75%, 31.25%, 43.75%, 56.25%, 68.75%, 81.25%, 93.75% {
            animation-timing-function: cubic-bezier(0.33,1,0.67,1);
            transform: translate(0,1px) rotate(-0.75deg);
          }
        }
        @keyframes truck-line {
          from { stroke-dashoffset: -18; }
          to   { stroke-dashoffset: 78; }
        }
        @keyframes truck-outside1 {
          from { stroke-dashoffset: 105; }
          to   { stroke-dashoffset: -105; }
        }
        @keyframes truck-outside2 {
          from { stroke-dashoffset: 168; }
          to   { stroke-dashoffset: -42; }
        }
        @keyframes truck-outside3 {
          from { stroke-dashoffset: 192; }
          to   { stroke-dashoffset: -18; }
        }
        @keyframes truck-wheel {
          from, 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%, to {
            animation-timing-function: cubic-bezier(0.33,0,0.67,0);
            transform: translate(0,0);
          }
          6.25%, 18.75%, 31.25%, 43.75%, 56.25%, 68.75%, 81.25%, 93.75% {
            animation-timing-function: cubic-bezier(0.33,1,0.67,1);
            transform: translate(0,-1px);
          }
        }
        @keyframes truck-wheel-spin {
          from {
            stroke-dashoffset: -15.71;
            transform: rotate(0);
          }
          to {
            stroke-dashoffset: 15.71;
            transform: rotate(-1440deg);
          }
        }
        @keyframes truck-window1 {
          from { stroke-dashoffset: -21; }
          to   { stroke-dashoffset: 189; }
        }
        @keyframes truck-window2 {
          from { stroke-dashoffset: -39; }
          to   { stroke-dashoffset: 171; }
        }
      `}</style>

      <svg
        className="truck"
        viewBox="0 0 48 24"
        width="48px"
        height="24px"
        aria-label="Cargando..."
        role="img"
      >
        <g
          fill="white"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          transform="translate(0,2)"
        >
          <g className="truck__body">
            <g strokeDasharray="105 105">
              <polyline className="truck__outside1" points="2 17,1 17,1 11,5 9,7 1,39 1,39 6" fill="none" />
              <polyline className="truck__outside2" points="39 12,39 17,31.5 17"               fill="none" />
              <polyline className="truck__outside3" points="22.5 17,11 17"                     fill="none" />
              <polyline className="truck__window1"  points="6.5 4,8 4,8 9,5 9"                fill="none" />
              <polygon  className="truck__window2"  points="10 4,10 9,14 9,14 4"              fill="white" />
            </g>
            <polyline
              className="truck__line"
              points="43 8,31 8"
              strokeDasharray="10 2 10 2 10 2 10 2 10 2 10 26"
              fill="none"
            />
            <polyline
              className="truck__line"
              points="47 10,31 10"
              strokeDasharray="14 2 14 2 14 2 14 2 14 18"
              fill="none"
            />
          </g>

          <g strokeDasharray="15.71 15.71">
            <g className="truck__wheel">
              <circle className="truck__wheel-spin" r="2.5" cx="6.5" cy="17" fill="white" />
            </g>
            <g className="truck__wheel">
              <circle className="truck__wheel-spin" r="2.5" cx="27"  cy="17" fill="white" />
            </g>
          </g>
        </g>
      </svg>
    </>
  )
}