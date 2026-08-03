"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { enquiryTopics, type EnquiryTopic } from "@/data/contact";
import { whatsappHref, whatsappConfigured } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Enquiry form.
 *
 * There is no backend in this build and no cart anywhere on the site, so the
 * form does not post — it composes the message and hands it to WhatsApp with
 * the fields already filled in. That keeps the single-channel commitment
 * intact and means nothing is collected by a server that does not exist.
 *
 * Where the WhatsApp number is still a placeholder the submit action falls
 * back to a mailto, so the form is never a dead end.
 */

interface Fields {
  name: string;
  organisation: string;
  email: string;
  topic: EnquiryTopic | "";
  message: string;
  /** Honeypot — hidden from people, attractive to bots. */
  website: string;
}

const inputBase =
  "type-body-s w-full border-b bg-transparent py-3.5 text-carbon " +
  "placeholder:text-carbon/35 transition-colors duration-400 ease-brand " +
  "focus:outline-none";

function fieldClass(invalid: boolean) {
  return cn(
    inputBase,
    invalid
      ? "border-carbon focus:border-carbon"
      : "border-carbon/20 focus:border-carbon",
  );
}

export function EnquiryForm() {
  const uid = useId();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    defaultValues: {
      name: "",
      organisation: "",
      email: "",
      topic: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    // Silently succeed for the honeypot rather than telling a bot it failed.
    if (values.website) {
      setSent(true);
      return;
    }

    const body = [
      `Name: ${values.name}`,
      values.organisation ? `Organisation: ${values.organisation}` : null,
      `Email: ${values.email}`,
      values.topic ? `Topic: ${values.topic}` : null,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    const target = whatsappConfigured
      ? `${whatsappHref()}%0A%0A${encodeURIComponent(body)}`
      : `mailto:${site.email}?subject=${encodeURIComponent(
          `Enquiry — ${values.topic || "General"}`,
        )}&body=${encodeURIComponent(body)}`;

    window.open(target, "_blank", "noopener,noreferrer");
    setSent(true);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="type-label text-carbon/62">
            Full name <span aria-hidden>*</span>
          </label>
          <input
            id={`${uid}-name`}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={cn("mt-3", fieldClass(Boolean(errors.name)))}
            {...register("name", { required: "Please give a name." })}
          />
          {errors.name ? (
            <p id={`${uid}-name-error`} className="type-body-s mt-2 text-carbon">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-org`} className="type-label text-carbon/62">
            Organisation
          </label>
          <input
            id={`${uid}-org`}
            autoComplete="organization"
            className={cn("mt-3", fieldClass(false))}
            {...register("organisation")}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="type-label text-carbon/62">
            Email <span aria-hidden>*</span>
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={cn("mt-3", fieldClass(Boolean(errors.email)))}
            {...register("email", {
              required: "Please give an email address.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "That does not look like an email address.",
              },
            })}
          />
          {errors.email ? (
            <p id={`${uid}-email-error`} className="type-body-s mt-2 text-carbon">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-topic`} className="type-label text-carbon/62">
            Topic
          </label>
          <select
            id={`${uid}-topic`}
            className={cn("mt-3", fieldClass(false))}
            {...register("topic")}
          >
            <option value="">Select a topic</option>
            {enquiryTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${uid}-message`}
            className="type-label text-carbon/62"
          >
            Message <span aria-hidden>*</span>
          </label>
          <textarea
            id={`${uid}-message`}
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? `${uid}-message-error` : undefined
            }
            className={cn("mt-3 resize-y", fieldClass(Boolean(errors.message)))}
            placeholder="Compound, batch, or the question itself."
            {...register("message", {
              required: "Please say what the enquiry is about.",
              minLength: {
                value: 10,
                message: "A little more detail helps the desk answer properly.",
              },
            })}
          />
          {errors.message ? (
            <p
              id={`${uid}-message-error`}
              className="type-body-s mt-2 text-carbon"
            >
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot. Hidden from people; left in the tab order for nobody. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input
          id={`${uid}-website`}
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "type-label group/submit relative inline-flex items-center justify-center gap-3",
            "bg-carbon px-8 py-4 text-soft",
            "transition-opacity duration-400 ease-brand",
            "disabled:opacity-50",
          )}
        >
          {whatsappConfigured ? "Open in WhatsApp" : "Compose email"}
          <span
            aria-hidden
            className="transition-transform duration-500 ease-brand group-hover/submit:translate-x-1 motion-reduce:transition-none"
          >
            &#8594;
          </span>
        </button>

        <p aria-live="polite" className="type-body-s text-carbon/55">
          {sent
            ? "Message composed — finish sending it in the window that opened."
            : whatsappConfigured
              ? "Your message opens in WhatsApp with these fields filled in. Nothing is stored here."
              : "Your message opens in your email client with these fields filled in. Nothing is stored here."}
        </p>
      </div>

      <p className="type-body-s mt-8 max-w-[62ch] text-carbon/45">
        This site holds no database and no analytics on this form. Whatever you
        type stays in your own device until you press send in the window that
        opens.
      </p>
    </form>
  );
}
