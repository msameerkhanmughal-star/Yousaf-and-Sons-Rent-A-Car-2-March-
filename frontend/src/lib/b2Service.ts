export const uploadToB2 = async (base64Data: string, fileName: string): Promise<string> => {
  try {
    // Convert base64 to blob
    const base64Content = base64Data.split(',')[1] || base64Data;
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', blob, fileName);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('B2 Upload Error:', error);
    throw error;
  }
};

export const getVehicleImagePath = (id: string) => `vehicles/${id}-${Date.now()}.jpg`;
export const getRentalImagePath = (id: string, type: string) => `rentals/${id}/${type}-${Date.now()}.jpg`;
