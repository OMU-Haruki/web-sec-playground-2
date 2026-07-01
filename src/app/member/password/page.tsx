"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordChangeRequest, passwordChangeRequestSchema } from "@/app/_types/PasswordChangeRequest";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import { faKey, faSpinner, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiResponse } from "@/app/_types/ApiResponse";

const Page: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const formMethods = useForm<PasswordChangeRequest>({
    mode: "onChange",
    resolver: zodResolver(passwordChangeRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;

  const setRootError = (errorMsg: string) => {
    formMethods.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  const clearRootOnChange =
    (originalOnChange: React.ChangeEventHandler<HTMLInputElement>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      originalOnChange(e);
      formMethods.clearErrors("root");
      setSuccessMessage("");
    };

  const onSubmit = async (formValues: PasswordChangeRequest) => {
    try {
      setIsPending(true);
      setRootError("");
      setSuccessMessage("");

      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setRootError("認証情報が見つかりません。再度ログインしてください。");
        setIsPending(false);
        return;
      }

      const res = await fetch("/api/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify(formValues),
      });

      setIsPending(false);

      if (!res.ok && res.status === 401) {
        setRootError("認証が無効です。再度ログインしてください。");
        return;
      }

      const body = (await res.json()) as ApiResponse<null>;
      if (!body.success) {
        setRootError(body.message);
        return;
      }

      setSuccessMessage("パスワードが正常に変更されました。");
      formMethods.reset();
    } catch (e) {
      const errorMsg =
        e instanceof Error ? e.message : "予期せぬエラーが発生しました。";
      setRootError(errorMsg);
      setIsPending(false);
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <div className="text-2xl font-bold mb-6">
        <FontAwesomeIcon icon={faKey} className="mr-2" />
        パスワードの変更
      </div>
      <form
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div>
          <label className="mb-2 block font-bold">現在のパスワード</label>
          <div className="relative">
            <TextInputField
              {...formMethods.register("currentPassword")}
              onChange={clearRootOnChange(formMethods.register("currentPassword").onChange)}
              type={showCurrentPassword ? "text" : "password"}
              placeholder="*****"
              disabled={isPending}
              error={!!fieldErrors.currentPassword}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <ErrorMsgField msg={fieldErrors.currentPassword?.message} />
        </div>

        <div>
          <label className="mb-2 block font-bold">新しいパスワード</label>
          <div className="relative">
            <TextInputField
              {...formMethods.register("newPassword")}
              onChange={clearRootOnChange(formMethods.register("newPassword").onChange)}
              type={showNewPassword ? "text" : "password"}
              placeholder="*****"
              disabled={isPending}
              error={!!fieldErrors.newPassword}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <ErrorMsgField msg={fieldErrors.newPassword?.message} />
        </div>

        <div>
          <label className="mb-2 block font-bold">新しいパスワード（確認）</label>
          <div className="relative">
            <TextInputField
              {...formMethods.register("newPasswordConfirm")}
              onChange={clearRootOnChange(formMethods.register("newPasswordConfirm").onChange)}
              type={showNewPasswordConfirm ? "text" : "password"}
              placeholder="*****"
              disabled={isPending}
              error={!!fieldErrors.newPasswordConfirm}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={showNewPasswordConfirm ? faEyeSlash : faEye} />
            </button>
          </div>
          <ErrorMsgField msg={fieldErrors.newPasswordConfirm?.message} />
          <ErrorMsgField msg={fieldErrors.root?.message} />
        </div>

        <Button
          variant="indigo"
          width="stretch"
          className="tracking-widest"
          isBusy={isPending}
          disabled={!formMethods.formState.isValid || isPending}
        >
          パスワードを変更する
        </Button>
      </form>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded border border-green-300">
          {successMessage}
        </div>
      )}
    </main>
  );
};

export default Page;
