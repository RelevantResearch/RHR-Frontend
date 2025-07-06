'use client';

import { useState } from 'react';

export default function NotFound() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <>
      <style>{`
        :root {
          --primary-color: #faca2e;
          --eye-pupil-color: #050505;
          --pupil-size: 30px;
          --eye-size: 80px;
          --button-padding-vertical: 0.9375rem; /* 15px */
          --button-padding-horizontal: 1.875rem; /* 30px */
        }

        @keyframes movePupil {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-10px, -10px); }
          50% { transform: translate(10px, 10px); }
          75% { transform: translate(-10px, 10px); }
        }

        .animate-movePupil {
          animation: movePupil 2s infinite ease-in-out;
          transform-origin: center center;
        }

        .animate-movePupil-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <main
        className={`flex min-h-screen items-center justify-center font-sans text-black ${
          isDark ? 'bg-black text-yellow-400' : 'bg-white text-black'
        }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="mx-auto flex flex-col items-center gap-8 text-center error-page">
          {/* Eyes */}
          <div className="flex gap-0.5">
            {/* Left eye */}
            <div
              className="eye relative grid place-items-center rounded-full"
              style={{ width: 'var(--eye-size)', height: 'var(--eye-size)', backgroundColor: 'var(--primary-color)' }}
            >
              <div
                className="eye__pupil animate-movePupil rounded-full"
                style={{ width: 'var(--pupil-size)', height: 'var(--pupil-size)', backgroundColor: 'var(--eye-pupil-color)' }}
              />
            </div>

            <div
              className="eye relative grid place-items-center rounded-full"
              style={{ width: 'var(--eye-size)', height: 'var(--eye-size)', backgroundColor: 'var(--primary-color)' }}
            >
              <div
                className="eye__pupil animate-movePupil animate-movePupil-reverse rounded-full"
                style={{ width: 'var(--pupil-size)', height: 'var(--pupil-size)', backgroundColor: 'var(--eye-pupil-color)' }}
              />
            </div>
          </div>

          <div className="error-page__heading">
            <h1 className="capitalize font-medium" style={{ color: 'var(--primary-color)', fontSize: '36px' }}>
              Looks like you're lost
            </h1>
            <p className="mt-2 font-light" style={{ fontSize: '26px' }}>
              404 error
            </p>
          </div>

          <a
            href="/dashboard"
            aria-label="back to home"
            title="back to home"
            className="inline-block rounded-[15px] border border-yellow-400 px-[var(--button-padding-horizontal)] py-[var(--button-padding-vertical)] text-[18px] font-light capitalize shadow-[0_7px_0_-2px_rgba(250,202,46,1)] transition-all duration-300 ease-in-out no-underline text-inherit hover:bg-yellow-400 hover:shadow-none hover:text-white"
          >
            back to home
          </a>
        </div>

        
      </main>
    </>
  );
}
