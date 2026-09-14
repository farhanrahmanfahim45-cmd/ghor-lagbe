import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/components/ui/Toast";
import { taka, longDate } from "@/lib/format";
import type { Property } from "@/types/property";

const DEFAULT_MESSAGE = "Hi, I'm interested in this property. Is it still available?";

/**
 * Structured inquiry, not chat. The owner gets the renter's budget and move-in
 * date up front, which is the half of the problem owners actually complain about.
 * Prototype only: the inquiry lands in client state and the demo owner inbox.
 */
export function InquiryModal({
  property,
  open,
  onClose,
}: {
  property: Property;
  open: boolean;
  onClose: () => void;
}) {
  const { requirements, addInquiry } = useAppState();
  const { notify } = useToast();
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [moveInDate, setMoveInDate] = useState(requirements.moveInDate);
  const [sent, setSent] = useState(false);

  const send = () => {
    addInquiry({
      propertyId: property.id,
      message,
      moveInDate,
      budgetMin: requirements.budgetMin,
      budgetMax: requirements.budgetMax,
    });
    setSent(true);
    notify("Inquiry sent to the owner");
  };

  const close = () => {
    onClose();
    // Reset a beat later so the panel doesn't visibly change while closing.
    window.setTimeout(() => {
      setSent(false);
      setMessage(DEFAULT_MESSAGE);
    }, 250);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={sent ? "Inquiry sent" : "Send an inquiry"}
      footer={
        sent ? (
          <Button fullWidth onClick={close}>
            Done
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={close}>
              Cancel
            </Button>
            <Button fullWidth onClick={send} disabled={message.trim().length === 0}>
              Send inquiry
            </Button>
          </div>
        )
      }
    >
      {sent ? (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-ink-soft">
            {property.owner.name} has your message, your budget and your move-in date. In this
            prototype it appears in the demo owner inbox — switch to owner mode to see it arrive.
          </p>
          <p className="rounded-lg bg-paper-deep p-3 text-xs leading-relaxed text-muted">
            No message is actually delivered to anyone. This is a prototype interaction over
            synthetic data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-hairline bg-paper-deep p-3">
            <p className="font-semibold text-ink">{property.title}</p>
            <p className="text-sm text-muted">
              {property.area} · {taka(property.cost.rent)}/month
            </p>
          </div>

          <div>
            <label htmlFor="inquiry-message" className="mb-1.5 block text-sm font-medium text-ink-soft">
              Your message
            </label>
            <textarea
              id="inquiry-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-hairline-strong bg-surface p-3 text-[0.9375rem] text-ink focus:border-forest-500 focus:outline-none"
            />
          </div>

          <Input
            label="When you'd move in"
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Shared with the owner</p>
            <ul className="flex flex-wrap gap-1.5">
              <li>
                <Badge tone="forest">
                  Budget {taka(requirements.budgetMin)}–{taka(requirements.budgetMax)}
                </Badge>
              </li>
              <li>
                <Badge tone="forest">Moving {longDate(moveInDate)}</Badge>
              </li>
              <li>
                <Badge tone="ok">Phone verified (demo)</Badge>
              </li>
            </ul>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Your phone number isn't shown until you choose to share it.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
