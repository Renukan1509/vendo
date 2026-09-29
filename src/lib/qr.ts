import QRCode from 'qrcode';

export interface MachineQRPayload {
  type: 'vendogo_machine';
  machineId: string;
  name: string;
  location: string;
  url: string;
}

export async function generateMachineQRDataUrl(machineId: string, origin?: string): Promise<string> {
  const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://vendogo.app');
  const targetUrl = `${baseUrl}/machine/${encodeURIComponent(machineId)}`;

  const payload: MachineQRPayload = {
    type: 'vendogo_machine',
    machineId,
    name: `Vendogo Machine #${machineId}`,
    location: 'Smart Vending Hub',
    url: targetUrl,
  };

  // We encode the deep link URL directly so any native smartphone camera scanner opens the machine page directly!
  return QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 480,
    color: {
      dark: '#064e3b', // Rich deep emerald
      light: '#ffffff',
    },
  });
}

export async function generateMachineQRSvg(machineId: string, origin?: string): Promise<string> {
  const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://vendogo.app');
  const targetUrl = `${baseUrl}/machine/${encodeURIComponent(machineId)}`;

  return QRCode.toString(targetUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 480,
    color: {
      dark: '#064e3b',
      light: '#ffffff',
    },
  });
}
