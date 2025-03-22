export const extractUserDetails = (data) => {
    if (!data) return [];
  
    return Object.keys(data).map((key) => {
      const user = data[key];
  
      // Extract details with fallback to "N/A" if missing
      return {
        username: user?.username || "N/A",
        email: user?.email || "N/A",
        businessName: user?.accounts?.[0]?.businessName || "N/A",
        mobileNo: user?.accounts?.[0]?.mobileNo || "N/A",
        country: user?.accounts?.[0]?.region_name || user?.accounts?.[0]?.country || "N/A",
        blockStatus: Math.random() < 0.5 ? "Blocked" : "Unblocked",
        tier:  Math.random() < 0.5 ? "free" : "pro"
      };
    });
  };