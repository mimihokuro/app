import React, { useState } from "react";
import {
  PiInfo,
  PiWarning,
  PiLink,
  PiEnvelope,
  PiCaretRight,
  PiCaretDown
} from "react-icons/pi";

const ToggleSection = ({ title, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-notion-border rounded-lg bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md mb-3">
      <div 
        className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none bg-notion-sidebar hover:bg-notion-hover transition-colors font-medium text-notion-text text-sm md:text-base"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-notion-textLight flex items-center justify-center">
          {isOpen ? <PiCaretDown /> : <PiCaretRight />}
        </span>
        {Icon && <Icon className="text-lg text-notion-textLight flex-shrink-0" />}
        <span>{title}</span>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-notion-border text-sm text-notion-textLight leading-relaxed bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const TopContents = () => {
  return (
    <div className="w-full mt-16">
      {/* 当サイトについて (Callout Block) */}
      <div className="bg-notion-highlight border border-notion-border rounded-lg p-5 flex gap-4 text-notion-text mb-6">
        <div className="text-2xl text-primary mt-0.5 flex-shrink-0 flex items-center justify-center">
          <PiInfo />
        </div>
        <div className="text-sm md:text-base leading-relaxed">
          <h3 className="font-semibold mb-1 text-notion-text">当サイトについて</h3>
          <p className="text-notion-textLight mb-2">
            『EC Tool Crate』は、ECに携わるWebデザイナーや運営者の日々の業務を手助けすべく、ECサイトの運営に役立つことを目的としたツールボックスです。
          </p>
          <p className="text-notion-textLight">
            メインではECに携わる方に使っていただくことを主な目的としていますが、ECに限らず活用できるツールも用意していますので、ECに携わる方以外にも使っていただけると非常に嬉しいです。
          </p>
        </div>
      </div>

      {/* アコーディオンセクション */}
      <div className="flex flex-col gap-1">
        <ToggleSection title="免責事項" icon={PiWarning}>
          <p className="mb-2">
            当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。そのため、掲載された内容によって生じた損害等の一切の責任を負いかねますので、あらかじめご了承ください。
          </p>
          <a 
            href="/privacy-policy" 
            className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-medium"
          >
            プライバシーポリシー <PiLink />
          </a>
        </ToggleSection>

        <ToggleSection title="リンクについて" icon={PiLink}>
          <p>
            当サイトは原則としてリンクフリーです。Webサイトやブログ、SNS等で当サイトへのリンクを掲載する際の許可や連絡は不要です。
          </p>
        </ToggleSection>

        <ToggleSection title="お問い合わせ" icon={PiEnvelope}>
          <p className="mb-3">
            機能の追加リクエスト、「こんなツールがほしい」というご意見、バグや不具合のご報告はお問い合わせフォームよりお気軽にお寄せください。
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-[#0f7b4b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#196343] transition-colors shadow-sm no-underline"
          >
            お問い合わせフォームを開く
          </a>
        </ToggleSection>
      </div>
    </div>
  );
};

export default TopContents;
