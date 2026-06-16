import { PolynomialRegression } from "ml-regression-polynomial";
import savitzkyGolay from "ml-savitzky-golay";

/**
 * Fit a polynomial to the baseline and correct the signal
 */
export function baselineCorrection(readFREQ, dataMag, order = 8) {
  if (!readFREQ || !dataMag || readFREQ.length < order + 1) {
    throw new Error(
      `Insufficient data points (${readFREQ?.length || 0}) to perform polynomial regression of order ${order}.`,
    );
  }

  for (let i = 0; i < readFREQ.length; i++) {
    if (isNaN(readFREQ[i]) || isNaN(dataMag[i])) {
      throw new Error(`Data contains NaN values. Cannot perform regression.`);
    }
  }

  try {
    const regression = new PolynomialRegression(readFREQ, dataMag, order);
    const coeffs = regression.coefficients;

    const polyfittedAll = readFREQ.map((x) => regression.predict(x));
    const magBaselineCorrected = dataMag.map(
      (val, i) => val - polyfittedAll[i],
    );

    return {
      magBaselineCorrected,
      polyfittedAll,
      coeffs,
    };
  } catch (error) {
    throw new Error(
      `Polynomial regression failed: ${error.message}. The input signal might be flat or unstable.`,
    );
  }
}

export function evalPolynomial(coeffs, readFREQ) {
  // ml-regression-polynomial outputs coefficients from lowest order to highest: c0 + c1*x + c2*x^2 + ...
  const polyfitted = readFREQ.map((x) => {
    let y = 0;
    for (let i = 0; i < coeffs.length; i++) {
      y += coeffs[i] * Math.pow(x, i);
    }
    return y;
  });
  return polyfitted;
}

/**
 * Filter using SG Filter.
 */
export function sgFilter(y, windowSize, order) {
  if (windowSize === 3 && order === 1) {
    const n = y.length;
    if (n === 0) return [];
    if (n === 1) return [...y];

    // Exact replica of Python custom savitzky_golay edge padding for window_size = 3
    const firstVal = y[0] - Math.abs(y[1] - y[0]);
    const lastVal = y[n - 1] + Math.abs(y[n - 2] - y[n - 1]);

    const result = new Float64Array(n);
    result[0] = (firstVal + y[0] + y[1]) / 3;
    for (let i = 1; i < n - 1; i++) {
      result[i] = (y[i - 1] + y[i] + y[i + 1]) / 3;
    }
    result[n - 1] = (y[n - 2] + y[n - 1] + lastVal) / 3;

    return Array.from(result);
  }

  const options = {
    windowSize: windowSize,
    derivative: 0,
    polynomial: order,
  };
  return savitzkyGolay(y, 1, options); // deltaTime = 1
}

/**
 * Find Peaks.
 * Matches: argrelextrema(mag, np.greater, order=dist)
 */
export function findPeak(freq, mag, dist) {
  let maxIndexes = [];
  let maxFreqs = [];
  let maxValues = [];

  for (let i = dist; i < mag.length - dist; i++) {
    let isPeak = true;
    const currentVal = mag[i];
    // Check neighbors
    for (
      let j = Math.max(0, i - dist);
      j <= Math.min(mag.length - 1, i + dist);
      j++
    ) {
      if (i !== j && mag[j] >= currentVal) {
        isPeak = false;
        break;
      }
    }
    if (isPeak) {
      maxIndexes.push(i);
      maxFreqs.push(freq[i]);
      maxValues.push(currentVal);
    }
  }

  if (maxIndexes.length === 0) {
    let globalMaxIdx = npArgmax(mag);
    return {
      maxIndexes: [globalMaxIdx],
      maxFreqs: [freq[globalMaxIdx]],
      maxValues: [mag[globalMaxIdx]],
    };
  }

  return { maxIndexes, maxFreqs, maxValues };
}

export function npArgmax(arr) {
  if (arr.length === 0) return -1;
  let MathMax = -Infinity;
  let maxIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > MathMax) {
      maxIndex = i;
      MathMax = arr[i];
    }
  }
  return maxIndex;
}

export function npAverage(arr) {
  if (arr.length === 0) return 0;
  let sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

/**
 * Fits a natural cubic spline to the input array y, assuming x values are 0, 1, ..., n-1
 */
export function naturalCubicSpline(y) {
  const n = y.length;
  // Solve tridiagonal system for c coefficients:
  // c[i-1] + 4*c[i] + c[i+1] = 3*(y[i+1] - 2*y[i] + y[i-1]) for i=1..n-2
  // with boundary conditions c[0] = 0, c[n-1] = 0.
  const a = new Float64Array(n - 2);
  const b = new Float64Array(n - 2);
  const c_diag = new Float64Array(n - 2);
  const d = new Float64Array(n - 2);

  for (let i = 0; i < n - 2; i++) {
    a[i] = 1.0;
    b[i] = 4.0;
    c_diag[i] = 1.0;
    d[i] = 3.0 * (y[i + 2] - 2.0 * y[i + 1] + y[i]);
  }

  // Thomas algorithm to solve tridiagonal system
  const cPrime = new Float64Array(n - 2);
  const dPrime = new Float64Array(n - 2);

  cPrime[0] = c_diag[0] / b[0];
  dPrime[0] = d[0] / b[0];

  for (let i = 1; i < n - 2; i++) {
    const denom = b[i] - a[i] * cPrime[i - 1];
    cPrime[i] = c_diag[i] / denom;
    dPrime[i] = (d[i] - a[i] * dPrime[i - 1]) / denom;
  }

  const c_sol = new Float64Array(n);
  c_sol[n - 2] = dPrime[n - 2];
  for (let i = n - 3; i >= 1; i--) {
    c_sol[i] = dPrime[i - 1] - cPrime[i - 1] * c_sol[i + 1];
  }
  c_sol[0] = 0;
  c_sol[n - 1] = 0;

  // Compute b and d coefficients for each segment
  const b_coeff = new Float64Array(n - 1);
  const d_coeff = new Float64Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    b_coeff[i] = y[i + 1] - y[i] - (c_sol[i + 1] + 2.0 * c_sol[i]) / 3.0;
    d_coeff[i] = (c_sol[i + 1] - c_sol[i]) / 3.0;
  }

  return {
    a: y,
    b: b_coeff,
    c: c_sol,
    d: d_coeff,
  };
}

/**
 * Evaluates the natural cubic spline at a given xVal (0 <= xVal <= n-1)
 */
export function evaluateSpline(spline, xVal) {
  const n = spline.a.length;
  let i = Math.floor(xVal);
  if (i < 0) i = 0;
  if (i >= n - 1) i = n - 2;
  const t = xVal - i;
  return (
    spline.a[i] +
    spline.b[i] * t +
    spline.c[i] * t * t +
    spline.d[i] * t * t * t
  );
}
