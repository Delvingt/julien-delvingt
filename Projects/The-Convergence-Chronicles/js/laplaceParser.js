class LaplaceParser {
  constructor() {
    this.dt = 0.1; // Default sampling time
  }

  /**
   * Parse a Laplace transform string like "1/(s+2)" or "(s+1)/(s^2+2*s+1)"
   * Returns numerator and denominator polynomial coefficients
   */
  parseLaplaceTransform(expression) {
    // Remove spaces
    expression = expression.replace(/\s/g, '');
    
    // Handle negative sign at the beginning
    if (expression.startsWith('-')) {
      expression = '0' + expression;
    }
    
    // Split into numerator and denominator
    const parts = expression.split('/');
    if (parts.length !== 2) {
      throw new Error('Expression must be in form numerator/denominator');
    }
    
    const numStr = parts[0].replace(/[()]/g, '');
    const denStr = parts[1].replace(/[()]/g, '');
    
    // Parse polynomials
    const num = this.parsePolynomial(numStr);
    const den = this.parsePolynomial(denStr);
    
    // Validate denominator is not zero
    if (den.every(coeff => coeff === 0)) {
      throw new Error('Denominator cannot be zero');
    }
    
    return { num, den };
  }

  /**
   * Parse polynomial string like "s^2+2*s+1" or "3*s+5"
   * Returns array of coefficients [highest power, ..., constant]
   */
  parsePolynomial(polyStr) {
    const coeffs = {};
    
    // Handle simple cases
    if (polyStr === '1') return [1];
    if (polyStr === 's') return [1, 0];
    if (polyStr === '-s') return [-1, 0];
    
    // Handle pure numbers (including negative)
    const pureNumber = polyStr.match(/^[+-]?\d*\.?\d+$/);
    if (pureNumber) {
      return [parseFloat(polyStr)];
    }
    
    // Handle expressions starting with minus
    polyStr = polyStr.replace(/^-/, '0-');
    
    // Split by + and - while keeping the signs
    const terms = polyStr.split(/(?=[+-])/).filter(term => term !== '');
    
    for (let term of terms) {
      term = term.trim();
      if (term === '' || term === '0') continue;
      
      // Extract coefficient and power
      let coeff = 1;
      let power = 0;
      
      if (term.includes('s')) {
        // Check for power notation (s^n)
        if (term.includes('^')) {
          // Match patterns like: 2*s^3, -s^2, s^2, +3*s^2
          const match = term.match(/^([+-]?\d*\.?\d*)\*?s\^(\d+)$/);
          if (match) {
            const coeffStr = match[1];
            coeff = coeffStr === '' || coeffStr === '+' ? 1 : 
                    coeffStr === '-' ? -1 : parseFloat(coeffStr);
            power = parseInt(match[2]);
          } else {
            console.error(`Invalid polynomial term: ${term}`);
            throw new Error(`Invalid term: ${term}`);
          }
        } else {
          // Linear term (s)
          // Match patterns like: 2*s, -s, s, +3*s
          const match = term.match(/^([+-]?\d*\.?\d*)\*?s$/);
          if (match) {
            const coeffStr = match[1];
            coeff = coeffStr === '' || coeffStr === '+' ? 1 : 
                    coeffStr === '-' ? -1 : parseFloat(coeffStr);
            power = 1;
          } else {
            console.error(`Invalid polynomial term: ${term}`);
            throw new Error(`Invalid term: ${term}`);
          }
        }
      } else {
        // Constant term
        coeff = parseFloat(term);
        if (isNaN(coeff)) {
          console.error(`Invalid constant term: ${term}`);
          throw new Error(`Invalid constant term: ${term}`);
        }
        power = 0;
      }
      
      coeffs[power] = (coeffs[power] || 0) + coeff;
    }
    
    // Convert to array format [highest power, ..., constant]
    const maxPower = Math.max(0, ...Object.keys(coeffs).map(Number));
    const result = [];
    
    for (let i = maxPower; i >= 0; i--) {
      result.push(coeffs[i] || 0);
    }
    
    return result;
  }

  /**
   * Convert continuous transfer function to discrete using bilinear transform
   * (Tustin's method)
   */
  continuousToDiscrete(num, den, dt) {
    // Validate inputs
    if (!num || !den || num.length === 0 || den.length === 0) {
      throw new Error('Invalid transfer function coefficients');
    }
    
    if (dt <= 0) {
      throw new Error('Sampling time must be positive');
    }
    
    // Check if dt is appropriate for the system dynamics
    if (den.length >= 2) {
      const tau = Math.abs(den[den.length - 1] / den[den.length - 2]);
      if (dt > tau / 5) {
        console.warn(`Warning: dt=${dt} may be too large for system time constant τ≈${tau.toFixed(3)}. Consider dt < ${(tau/5).toFixed(3)}`);
      }
    }
    
    // For now, handle first and second order systems
    if (den.length > 3 || num.length > 3) {
      throw new Error('Currently supports up to 2nd order systems');
    }
    
    // Use Tustin's method
    const c = 2 / dt;
    
    // Convert using bilinear transform
    let numZ, denZ;
    
    if (den.length === 1) {
      // Zero order (pure gain)
      numZ = [num[0] / den[0]];
      denZ = [1];
      
    } else if (den.length === 2 && num.length <= 2) {
      // First order system
      // Handle general first-order: (b0*s + b1)/(a0*s + a1)
      const b0 = num.length > 1 ? num[0] : 0;
      const b1 = num[num.length - 1];
      const a0 = den[0];
      const a1 = den[1];
      
      // Bilinear transform coefficients
      const k = 1 / (a0 * c + a1);
      
      numZ = [
        k * (b0 * c + b1),
        k * (-b0 * c + b1)
      ];
      
      denZ = [
        1,
        (a1 - a0 * c) / (a0 * c + a1)
      ];
      
    } else if (den.length === 3 && num.length <= 3) {
      // Second order system
      // Handle general second-order: (b0*s^2 + b1*s + b2)/(a0*s^2 + a1*s + a2)
      const b0 = num.length > 2 ? num[0] : 0;
      const b1 = num.length > 1 ? num[1] : 0;
      const b2 = num[num.length - 1];
      const a0 = den[0];
      const a1 = den[1];
      const a2 = den[2];
      
      // Bilinear transform coefficients
      const c2 = c * c;
      const k = 1 / (a0 * c2 + a1 * c + a2);
      
      numZ = [
        k * (b0 * c2 + b1 * c + b2),
        k * (2 * b2 - 2 * b0 * c2),
        k * (b0 * c2 - b1 * c + b2)
      ];
      
      denZ = [
        1,
        k * (2 * a2 - 2 * a0 * c2) / k,
        k * (a0 * c2 - a1 * c + a2) / k
      ];
      
    } else {
      throw new Error('Unsupported system configuration');
    }
    
    // Check stability in discrete domain
    if (denZ.length > 1) {
      const stable = this.checkDiscreteStability(denZ);
      if (!stable) {
        console.warn('Warning: Discrete system may be unstable');
      }
    }
    
    return { numZ, denZ };
  }

  /**
   * Check if discrete system is stable (all poles inside unit circle)
   */
  checkDiscreteStability(denZ) {
    // For first order: pole = -denZ[1]
    if (denZ.length === 2) {
      return Math.abs(-denZ[1]) < 1;
    }
    
    // For second order: check both poles
    if (denZ.length === 3) {
      const a = denZ[0];
      const b = denZ[1];
      const c = denZ[2];
      
      // Calculate poles using quadratic formula
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant >= 0) {
        // Real poles
        const sqrt_disc = Math.sqrt(discriminant);
        const pole1 = (-b + sqrt_disc) / (2 * a);
        const pole2 = (-b - sqrt_disc) / (2 * a);
        return Math.abs(pole1) < 1 && Math.abs(pole2) < 1;
      } else {
        // Complex poles - check magnitude
        const real = -b / (2 * a);
        const imag = Math.sqrt(-discriminant) / (2 * a);
        const magnitude = Math.sqrt(real * real + imag * imag);
        return magnitude < 1;
      }
    }
    
    return true;
  }

  /**
   * Create a digital filter function from discrete transfer function
   */
  createDigitalFilter(numZ, denZ) {
    // Normalize coefficients by denZ[0]
    const a0 = denZ[0];
    if (Math.abs(a0) < 1e-10) {
      throw new Error('Invalid denominator coefficient');
    }
    
    numZ = numZ.map(n => n / a0);
    denZ = denZ.map(d => d / a0);
    
    // State for the filter
    const order = Math.max(numZ.length, denZ.length) - 1;
    const x = new Array(order).fill(0); // Input history
    const y = new Array(order).fill(0); // Output history
    
    return function(input) {
      // Calculate output using difference equation
      let output = 0;
      
      // Current input contribution
      output += numZ[0] * input;
      
      // Past input contributions
      for (let i = 1; i < numZ.length && i <= order; i++) {
        output += numZ[i] * x[i - 1];
      }
      
      // Past output contributions (feedback)
      for (let i = 1; i < denZ.length && i <= order; i++) {
        output -= denZ[i] * y[i - 1];
      }
      
      // Update state (shift histories)
      for (let i = order - 1; i > 0; i--) {
        x[i] = x[i - 1];
        y[i] = y[i - 1];
      }
      
      if (order > 0) {
        x[0] = input;
        y[0] = output;
      }
      
      return output;
    };
  }
}