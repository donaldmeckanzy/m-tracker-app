// Utility to help with cross-device sharing in development
export const getNetworkUrls = () => {
  const currentUrl = window.location.origin;
  const isDevelopment = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
  
  if (!isDevelopment) {
    return { current: currentUrl, alternatives: [] };
  }
  
  // Extract port from current URL
  const port = window.location.port || '5174';
  
  // Common network IP patterns for development
  const possibleNetworkIPs = [
    '192.168.1.', '192.168.0.', '192.168.2.', '10.0.0.', '172.16.'
  ];
  
  // Generate potential network URLs
  const alternatives = possibleNetworkIPs.map(prefix => {
    // Common last octets for development machines
    return [1, 2, 3, 4, 5, 10, 100, 101, 102].map(lastOctet => 
      `http://${prefix}${lastOctet}:${port}`
    );
  }).flat();
  
  return {
    current: currentUrl,
    alternatives,
    instructions: {
      title: "For Mobile Access in Development:",
      steps: [
        "1. Find your computer's IP address",
        "2. Replace 'localhost' with your IP address", 
        "3. Make sure your phone is on the same WiFi network",
        "4. Example: Change localhost:5174 to 192.168.1.100:5174"
      ]
    }
  };
};

export const getComputerIP = async (): Promise<string | null> => {
  try {
    // This is a simple method that works in browsers
    // Create a dummy WebRTC connection to get local IP
    const pc = new RTCPeerConnection({
      iceServers: []
    });
    
    pc.createDataChannel("");
    
    return new Promise((resolve) => {
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          resolve(null);
          return;
        }
        
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
        if (myIP) {
          resolve(myIP[1]);
          pc.close();
        }
      };
      
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      // Timeout after 3 seconds
      setTimeout(() => {
        resolve(null);
        pc.close();
      }, 3000);
    });
  } catch (error) {
    console.warn('Could not detect IP address:', error);
    return null;
  }
};