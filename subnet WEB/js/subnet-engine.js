/**
 * Subnet Engine - Core IP and Subnetting Math Functions
 * Supports IPv4 calculations, binary manipulation, VLSM, and problem generation.
 */

const SubnetEngine = (() => {
  // Convert IP string "192.168.1.1" to 32-bit unsigned integer
  function ipToInt(ip) {
    if (!ip) return 0;
    const parts = ip.trim().split('.').map(p => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return 0;
    }
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  }

  // Convert 32-bit unsigned integer to IP string
  function intToIp(intVal) {
    const i = intVal >>> 0;
    return [
      (i >>> 24) & 255,
      (i >>> 16) & 255,
      (i >>> 8) & 255,
      i & 255
    ].join('.');
  }

  // Validate IPv4 format
  function isValidIp(ip) {
    if (typeof ip !== 'string') return false;
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return false;
    return parts.every(p => {
      const n = Number(p);
      return /^\d+$/.test(p) && n >= 0 && n <= 255;
    });
  }

  // Convert CIDR prefix (e.g. 24) to Subnet Mask integer
  function cidrToIntMask(cidr) {
    const c = Math.max(0, Math.min(32, parseInt(cidr, 10) || 0));
    if (c === 0) return 0;
    return ((0xFFFFFFFF << (32 - c)) >>> 0);
  }

  // CIDR to Mask string "255.255.255.0"
  function cidrToMask(cidr) {
    return intToIp(cidrToIntMask(cidr));
  }

  // Mask string to CIDR number
  function maskToCidr(maskStr) {
    const intVal = ipToInt(maskStr);
    const bin = (intVal >>> 0).toString(2);
    // Count leading ones
    let count = 0;
    for (let i = 0; i < bin.length; i++) {
      if (bin[i] === '1') count++;
      else break;
    }
    return count;
  }

  // Calculate Network Address integer and string
  function getNetworkAddress(ip, cidr) {
    const ipInt = typeof ip === 'number' ? ip : ipToInt(ip);
    const mask = cidrToIntMask(cidr);
    const netInt = (ipInt & mask) >>> 0;
    return intToIp(netInt);
  }

  // Calculate Broadcast Address integer and string
  function getBroadcastAddress(ip, cidr) {
    const ipInt = typeof ip === 'number' ? ip : ipToInt(ip);
    const mask = cidrToIntMask(cidr);
    const wildcard = (~mask) >>> 0;
    const bcastInt = ((ipInt & mask) | wildcard) >>> 0;
    return intToIp(bcastInt);
  }

  // Usable Host range
  function getUsableRange(ip, cidr) {
    const c = parseInt(cidr, 10);
    const netInt = (ipToInt(ip) & cidrToIntMask(c)) >>> 0;
    const bcastInt = (netInt | ((~cidrToIntMask(c)) >>> 0)) >>> 0;

    if (c >= 31) {
      // /31 is point-to-point (RFC 3021) or /32 is host
      if (c === 31) {
        return {
          first: intToIp(netInt),
          last: intToIp(bcastInt),
          count: 2
        };
      }
      return {
        first: intToIp(netInt),
        last: intToIp(netInt),
        count: 1
      };
    }

    const firstInt = (netInt + 1) >>> 0;
    const lastInt = (bcastInt - 1) >>> 0;
    return {
      first: intToIp(firstInt),
      last: intToIp(lastInt),
      count: Math.max(0, Math.pow(2, 32 - c) - 2)
    };
  }

  // Number of total & usable hosts
  function getTotalHosts(cidr) {
    const c = parseInt(cidr, 10);
    return Math.pow(2, 32 - c);
  }

  function getUsableHosts(cidr) {
    const c = parseInt(cidr, 10);
    if (c === 32) return 1;
    if (c === 31) return 2;
    return Math.max(0, Math.pow(2, 32 - c) - 2);
  }

  // Wildcard mask
  function getWildcardMask(cidr) {
    const mask = cidrToIntMask(cidr);
    return intToIp((~mask) >>> 0);
  }

  // Magic Number (Block Size in the interesting octet)
  function getMagicNumberInfo(cidr) {
    const c = parseInt(cidr, 10);
    const octetIndex = Math.floor(c / 8); // 0, 1, 2, 3
    const bitsInOctet = c % 8;
    const interestingOctet = bitsInOctet === 0 ? octetIndex : octetIndex + 1;
    const blockSize = bitsInOctet === 0 ? 1 : Math.pow(2, 8 - bitsInOctet);
    const maskOctets = cidrToMask(c).split('.').map(Number);
    const maskValue = maskOctets[interestingOctet - 1] || 255;
    const magicNumber = 256 - maskValue;

    return {
      interestingOctet: Math.min(4, Math.max(1, interestingOctet)),
      maskValue: maskValue,
      blockSize: blockSize,
      magicNumber: bitsInOctet === 0 ? 256 : magicNumber
    };
  }

  // Convert IP or Mask to 4 8-bit binary strings
  function toBinaryOctets(ip) {
    const intVal = typeof ip === 'number' ? ip : ipToInt(ip);
    return [
      ((intVal >>> 24) & 255).toString(2).padStart(8, '0'),
      ((intVal >>> 16) & 255).toString(2).padStart(8, '0'),
      ((intVal >>> 8) & 255).toString(2).padStart(8, '0'),
      (intVal & 255).toString(2).padStart(8, '0')
    ];
  }

  // Determine IP Class
  function getIpClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet === 127) return 'Loopback';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Experimental)';
    return 'Unknown';
  }

  // Is Private Address (RFC 1918)
  function isPrivate(ip) {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    return false;
  }

  // Find minimum CIDR for given required host count
  function findMinCidrForHosts(requiredHosts) {
    for (let c = 30; c >= 1; c--) {
      if (getUsableHosts(c) >= requiredHosts) {
        return c;
      }
    }
    return 1;
  }

  // Calculate VLSM allocations
  function calculateVLSM(baseIp, baseCidr, subnetsReq) {
    // subnetsReq: [{ name: 'IT', hosts: 50 }, ...]
    const sorted = [...subnetsReq].sort((a, b) => b.hosts - a.hosts);
    let currentIpInt = (ipToInt(baseIp) & cidrToIntMask(baseCidr)) >>> 0;
    const baseBroadcast = (currentIpInt | ((~cidrToIntMask(baseCidr)) >>> 0)) >>> 0;

    const results = [];
    let overflow = false;

    for (const req of sorted) {
      const cidr = findMinCidrForHosts(req.hosts);
      const totalAllocated = getTotalHosts(cidr);
      const netAddress = intToIp(currentIpInt);
      const bcastInt = (currentIpInt + totalAllocated - 1) >>> 0;
      const bcastAddress = intToIp(bcastInt);
      const usable = getUsableRange(netAddress, cidr);

      if (bcastInt > baseBroadcast) {
        overflow = true;
      }

      results.push({
        name: req.name,
        requiredHosts: req.hosts,
        allocatedHosts: getUsableHosts(cidr),
        totalIps: totalAllocated,
        cidr: cidr,
        mask: cidrToMask(cidr),
        network: netAddress,
        firstUsable: usable.first,
        lastUsable: usable.last,
        broadcast: bcastAddress,
        wastedHosts: getUsableHosts(cidr) - req.hosts,
        isOverflow: bcastInt > baseBroadcast
      });

      currentIpInt = (bcastInt + 1) >>> 0;
    }

    return {
      subnets: results,
      hasOverflow: overflow,
      nextFreeIp: intToIp(currentIpInt)
    };
  }

  // Generate All Subnets for a given parent network and target prefix
  function generateSubnetsList(baseIp, baseCidr, targetCidr, limit = 64) {
    const bCidr = parseInt(baseCidr, 10);
    const tCidr = parseInt(targetCidr, 10);
    if (tCidr < bCidr) return [];

    const numSubnets = Math.pow(2, tCidr - bCidr);
    const subnets = [];
    const blockSize = getTotalHosts(tCidr);
    let currentInt = (ipToInt(baseIp) & cidrToIntMask(bCidr)) >>> 0;

    const countToGenerate = Math.min(numSubnets, limit);
    for (let i = 0; i < countToGenerate; i++) {
      const netStr = intToIp(currentInt);
      const bcastStr = intToIp((currentInt + blockSize - 1) >>> 0);
      const range = getUsableRange(netStr, tCidr);

      subnets.push({
        index: i + 1,
        network: netStr,
        cidr: tCidr,
        mask: cidrToMask(tCidr),
        firstUsable: range.first,
        lastUsable: range.last,
        broadcast: bcastStr,
        usableHosts: getUsableHosts(tCidr)
      });

      currentInt = (currentInt + blockSize) >>> 0;
    }

    return {
      totalSubnets: numSubnets,
      generated: subnets,
      truncated: numSubnets > limit
    };
  }

  // Random subnet generator for game challenges
  function generateRandomChallenge(difficulty = 'easy') {
    // difficulty: 'easy' (/24 to /30), 'medium' (/16 to /28), 'hard' (/8 to /30, classful & classless)
    let cidr;
    let ipOctets = [];

    if (difficulty === 'easy') {
      cidr = Math.floor(Math.random() * 6) + 24; // 24 to 29
      ipOctets = [192, 168, Math.floor(Math.random() * 250) + 1, Math.floor(Math.random() * 254) + 1];
    } else if (difficulty === 'medium') {
      cidr = Math.floor(Math.random() * 11) + 18; // 18 to 28
      ipOctets = [172, Math.floor(Math.random() * 16) + 16, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1];
    } else {
      cidr = Math.floor(Math.random() * 21) + 9; // 9 to 29
      ipOctets = [10, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1];
    }

    const ip = ipOctets.join('.');
    const network = getNetworkAddress(ip, cidr);
    const broadcast = getBroadcastAddress(ip, cidr);
    const range = getUsableRange(ip, cidr);
    const mask = cidrToMask(cidr);
    const hosts = getUsableHosts(cidr);
    const magic = getMagicNumberInfo(cidr);

    return {
      ip,
      cidr,
      mask,
      network,
      broadcast,
      firstUsable: range.first,
      lastUsable: range.last,
      usableHosts: hosts,
      totalHosts: getTotalHosts(cidr),
      magicNumber: magic.magicNumber,
      interestingOctet: magic.interestingOctet,
      blockSize: magic.blockSize
    };
  }

  return {
    ipToInt,
    intToIp,
    isValidIp,
    cidrToIntMask,
    cidrToMask,
    maskToCidr,
    getNetworkAddress,
    getBroadcastAddress,
    getUsableRange,
    getTotalHosts,
    getUsableHosts,
    getWildcardMask,
    getMagicNumberInfo,
    toBinaryOctets,
    getIpClass,
    isPrivate,
    findMinCidrForHosts,
    calculateVLSM,
    generateSubnetsList,
    generateRandomChallenge
  };
})();

if (typeof window !== 'undefined') {
  window.SubnetEngine = SubnetEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SubnetEngine;
}

