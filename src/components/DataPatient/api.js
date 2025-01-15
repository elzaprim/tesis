// api.js
export const fetchPatients = async () => {
    try {
      const response = await fetch("https://d103-114-10-144-134.ngrok-free.app/profile");
      const data = await response.json();
      return data; // Mengembalikan data jika berhasil
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Mengembalikan null jika ada error
    }
  };
  