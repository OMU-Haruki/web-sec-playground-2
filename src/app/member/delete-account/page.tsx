"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountDeleteRequest, accountDeleteRequestSchema } from "@/app/_types/AccountDeleteRequest";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import { faUserXmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiResponse } from "@/app/_types/ApiResponse";

const Page: React.FC = () => {
  const [isPending, setIsPending] = useState(false);

  const formMethods = useForm<AccountDeleteRequest>({
    mode: "onChange",
    resolver: zodResolver(accountDeleteRequestSchema),
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
    };

  const onSubmit = async (formValues: AccountDeleteRequest) => {
    if (!window.confirm("本当に退会しますか？ この操作は取り消せません。")) {
      return;
    }

    try {
      setIsPending(true);
      setRootError("");

      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setRootError("認証情報が見つかりません。再度ログインしてください。");
        setIsPending(false);
        return;
      }

      const res = await fetch("/api/user", {
        method: "DELETE",
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

      // 成功した場合、JWT を破棄してトップページへ遷移（ハードリロード）
      localStorage.removeItem("jwt");
      window.alert("退会処理が完了しました。ご利用ありがとうございました。");
      window.location.href = "/";
    } catch (e) {
      const errorMsg =
        e instanceof Error ? e.message : "予期せぬエラーが発生しました。";
      setRootError(errorMsg);
      setIsPending(false);
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <div className="text-2xl font-bold mb-6 text-red-600 flex items-center">
        <FontAwesomeIcon icon={faUserXmark} className="mr-2" />
        アカウントの削除（退会）
      </div>

      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
        <strong>警告:</strong> 退会すると、あなたのアカウント情報および関連データはすべて削除され、元に戻すことはできません。
      </div>

      <form
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div>
          <label className="mb-2 block font-bold">確認のため、現在のパスワードを入力してください</label>
          <TextInputField
            {...formMethods.register("currentPassword")}
            onChange={clearRootOnChange(formMethods.register("currentPassword").onChange)}
            type="password"
            placeholder="*****"
            disabled={isPending}
            error={!!fieldErrors.currentPassword}
            autoComplete="off"
          />
          <ErrorMsgField msg={fieldErrors.currentPassword?.message} />
          <ErrorMsgField msg={fieldErrors.root?.message} />
        </div>

        <Button
          variant="indigo"
          width="stretch"
          className="tracking-widest bg-red-600 hover:bg-red-700 mt-4"
          isBusy={isPending}
          disabled={!formMethods.formState.isValid || isPending}
        >
          退会する
        </Button>
      </form>
    </main>
  );
};

export default Page;
