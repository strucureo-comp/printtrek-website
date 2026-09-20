'use client';

import { useEffect } from 'react';

/** Strucureo developer footprint — branded console message. */
export default function BrandConsole() {
  useEffect(() => {
    console.log(
      '%c● %cPrint Trek %c— precision 3D lab · developed by %cStrucureo %chttps://strucureo.com',
      'color:#b98a2f;font-size:14px',
      'color:#f5efe2;font-weight:bold;font-size:12px',
      'color:#8a7f6a;font-size:11px',
      'color:#b98a2f;font-weight:bold;font-size:11px',
      'color:#8a7f6a;font-size:11px'
    );
  }, []);
  return null;
}
