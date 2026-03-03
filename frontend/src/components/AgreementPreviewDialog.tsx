import { Eye, X, Download, Printer, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InvoicePreview } from '@/components/InvoicePreview';
import { Rental } from '@/types/rental';
import { generateInvoicePDF } from '@/lib/pdfGenerator';
import { formatCurrency, formatDate } from '@/lib/storage';

interface AgreementPreviewDialogProps {
  rental: Rental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgreementPreviewDialog = ({ 
  rental, 
  open, 
  onOpenChange 
}: AgreementPreviewDialogProps) => {
  if (!rental) return null;

  const handlePrint = () => {
    generateInvoicePDF(rental);
  };

  const handleWhatsApp = () => {
    const agreementNum = rental.agreementNumber || rental.id.toUpperCase();
    const message = `🚗 *Yousif & Sons Rent A Car*
━━━━━━━━━━━━━━━━
📋 *Agreement {agreementNum}*

👤 *Client:* ${rental.client.fullName}
📱 *Phone:* ${rental.client.phone}

🚙 *Vehicle:* ${rental.vehicle.name}

📅 *Delivery:* ${formatDate(rental.deliveryDate)} at ${rental.deliveryTime}
📅 *Return:* ${formatDate(rental.returnDate)} at ${rental.returnTime}

💰 *Total:* Rs ${rental.totalAmount.toLocaleString()}
💵 *Paid:* Rs ${rental.advancePayment.toLocaleString()}
📊 *Balance:* Rs ${rental.balance.toLocaleString()}
━━━━━━━━━━━━━━━━

Thank you for choosing Yousif & Sons!`;

    let phone = rental.client.phone.replace(/[\s\-\(\)]/g, '');
    if (phone.startsWith('03')) {
      phone = '92' + phone.substring(1);
    }

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              Agreement Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsApp}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4">
          <InvoicePreview rental={rental} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
