"use client";

import { FormField } from "@/app/components/FormField";
import { Messages } from "@/lib/header";
import React, { FormEvent, useState } from "react";
import {
  ContactFormData,
  FormErrors,
  FormField as FormFieldType,
} from "@/app/types/contact";
import { Backspace, Message } from "@mui/icons-material";

interface ContactFormProps {
  messages: Messages;
}

export const ContactForm = ({ messages }: ContactFormProps) => {
  const [formData, setFormData] = useState<
    Pick<
      ContactFormData,
      "firstName" | "lastName" | "phone" | "email" | "message"
    >
  >({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const formFields: Array<FormFieldType & { group?: "name" | "contact" }> = [
    {
      name: "firstName",
      label: messages["contact.form.firstName.label"],
      placeholder: messages["contact.form.firstName.placeholder"],
      type: "text",
      required: true,
      group: "name",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: "lastName",
      label: messages["contact.form.lastName.label"],
      placeholder: messages["contact.form.lastName.placeholder"],
      type: "text",
      required: true,
      group: "name",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: "phone",
      label: messages["contact.form.phone.label"],
      placeholder: messages["contact.form.phone.placeholder"],
      type: "tel",
      required: true,
      group: "contact",
      validation: {
        pattern: /^[\d\s+()-]+$/,
      },
    },
    {
      name: "email",
      label: messages["contact.form.email.label"],
      placeholder: messages["contact.form.email.placeholder"],
      type: "email",
      required: true,
      group: "contact",
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: "message",
      label: messages["contact.form.message.label"],
      placeholder: messages["contact.form.message.placeholder"],
      type: "textarea",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 500,
      },
    },
  ];

  const nameFields = formFields.filter((f) => f.group === "name");
  const contactFields = formFields.filter((f) => f.group === "contact");
  const messageField = formFields.find((f) => f.name === "message");

  const validateField = (
    name: keyof typeof formData,
    value: string
  ): string | undefined => {
    const field = formFields.find((f) => f.name === name);
    if (!field) return undefined;
    if (field.required && !value.trim()) {
      return messages["contact.validation.required"];
    }
    if (
      field.validation?.minLength &&
      value.length < field.validation.minLength
    ) {
      return messages["contact.validation.minLength"].replace(
        "{min}",
        field.validation.minLength.toString()
      );
    }
    if (
      field.validation?.maxLength &&
      value.length > field.validation.maxLength
    ) {
      return messages["contact.validation.maxLength"].replace(
        "{max}",
        field.validation.maxLength.toString()
      );
    }
    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      if (field.type === "email") {
        return messages["contact.validation.email"];
      }
      if (field.type === "tel") {
        return messages["contact.validation.phone"];
      }
      return (
        field.validation.errorMessage || messages["contact.validation.required"]
      );
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof typeof formData, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
    });
    setErrors({});
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);
      // submission success
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      // submission error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[var(--primary-2)] rounded-lg p-6 lg:p-8 shadow-xl"
      noValidate
    >
      <div className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid md:grid-cols-2 gap-4">
          {nameFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name as keyof typeof formData]}
              error={errors[field.name as keyof typeof errors]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </div>

        {/* Contact Fields Row */}
        <div className="grid md:grid-cols-2 gap-4">
          {contactFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name as keyof typeof formData]}
              error={errors[field.name as keyof typeof errors]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </div>

        {/* Message Field */}
        {messageField && (
          <FormField
            field={messageField}
            value={formData.message}
            error={errors.message}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}

        {/* Submit Button */}
        <div className="w-full grid md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="center gap-2 w-full font-semibold text-lg h-14 px-6 rounded-lg shadow-xl border-2 border-[var(--neutral-6)] hover:border-transparent hover:bg-[var(--neutral-6)] hover:text-[var(--text-on-primary)]"
          >
            <Backspace /> {messages["contact.form.clear"]}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="center gap-1 w-full bg-[var(--neutral-6)] border-2 border-transparent hover:bg-transparent hover:border-[var(--neutral-6)] hover:text-[var(--neutral-6)] disabled:opacity-50 disabled:cursor-not-allowed text-lg text-[var(--text-on-primary)] font-semibold h-14 px-6 rounded-lg shadow-xl"
          >
            <Message className="text-xl" />
            {isSubmitting
              ? messages["contact.form.submitting"]
              : messages["contact.form.submit"]}
          </button>
        </div>
      </div>
    </form>
  );
};
