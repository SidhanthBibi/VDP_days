// QR_Code.jsx using react-qr-code library
import { useState } from 'react';
import QRCode from 'react-qr-code';

function QrCode() {
  const [amount, setAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const generateQRCode = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setShowQR(true);
  };

  const upiUrl = `upi://pay?pa=georgeadorn58@oksbi&pn=Adorn&am=${amount}&cu=INR`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#000e23]">
      <div className="bg-[#001D3D] rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center text-center">
        <h1 className="text-[#F0CB46] text-3xl font-bold mb-6">UPI QR Code Generator</h1>
        
        <div className="w-full mb-6">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter Amount (₹)"
            min="1"
            className="w-full p-3 border-2 border-[#003566] bg-[#000e23] text-[#CCA000] rounded-lg text-base outline-none focus:border-[#F0CB46] focus:shadow-[0_0_10px_rgba(240,203,70,0.3)] transition-all duration-300"
          />
        </div>
        
        <button
          onClick={generateQRCode}
          className="bg-[#F0CB46] text-[#000e23] border-none py-3 px-6 rounded-lg cursor-pointer text-base font-bold transition-all duration-300 hover:bg-[#CCA000] hover:scale-105"
        >
          Generate QR Code
        </button>
        
        {showQR && (
          <div className="bg-white p-4 rounded-xl max-w-[250px] w-full flex justify-center items-center mt-5">
            <QRCode
              value={upiUrl}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default QrCode;