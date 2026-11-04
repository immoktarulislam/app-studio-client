"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "./ui/Modal";

/**
 * Password recovery is intentionally informational for this build
 * (the assignment asks not to implement real email resets).
 */
export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success(
      "Password recovery is disabled for this demo. Contact studiospace.help@example.com and our team will reset it for you."
    );
    setEmail("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Forgot your password?"
      description="Enter the email you registered with and our support team will help you get back into your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="forgot-email">
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            className="input"
            placeholder="you@studio.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full py-2.5">
          Request reset help
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost w-full py-2.5"
        >
          Back to login
        </button>
      </form>
    </Modal>
  );
}
