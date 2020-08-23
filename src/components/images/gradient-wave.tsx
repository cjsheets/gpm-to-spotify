export const GradientWave = () => (
  <div
    style={{
      height: 150,
      overflow: 'hidden',
      width: '100vw',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}
  >
    <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
      <defs>
        <linearGradient id="gpmToSpotGrad" x1="20%" y1="0%" x2="80%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'rgb(255,61,2)', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(29,185,84)', stopOpacity: 0.9 }} />
        </linearGradient>
      </defs>
      <path
        d="M-12.24,70.17 C150.00,150.33 193.19,-50.28 525.01,98.05 L518.25,-63.22 L-2.07,-54.27 Z"
        style={{ stroke: 'none', fill: 'url(#gpmToSpotGrad)' }}
      ></path>
    </svg>
  </div>
);
