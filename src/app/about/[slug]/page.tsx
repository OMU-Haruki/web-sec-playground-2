import { prisma } from "@/libs/prisma";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { AboutView } from "@/app/_components/AboutView";

// キャッシュを無効化して常に最新のプロフィールを取得
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { aboutSlug: slug },
    select: {
      name: true,
      aboutContent: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faIdCard} className="mr-1.5" />
        {user.name} のプロフィール
      </div>
      <AboutView about={{
        userName: user.name,
        aboutSlug: slug,
        aboutContent: user.aboutContent,
      }} />
    </main>
  );
};

export default Page;
