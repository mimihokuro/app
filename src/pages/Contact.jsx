import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  useToast,
  Select,
} from "@chakra-ui/react";
import { PiPaperPlaneTilt, PiCheckCircle } from "react-icons/pi";
import usePageMetadata from "../hooks/usePageMetadata";
import PageTitle from "../components/PageTitle";

const Contact = () => {
  usePageMetadata({
    title: "お問い合わせ | EC Tool Crate",
    description: "EC Tool Crateへのお問い合わせ・ご意見・バグ報告フォームです。ツールのリクエストやご感想もお気軽にお寄せください。",
    canonicalUrl: "https://ec-tool-crate.com/contact",
    ogTitle: "お問い合わせ | EC Tool Crate",
    ogDescription: "EC Tool Crateへのお問い合わせ・ご意見・ご要望フォームです。",
    ogType: "website",
  });

  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    subject: "",
    message: "",
    website_hp: "", // ハニーポット（スパムボット対策の隠しフィールド）
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "お名前を入力してください。";
    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレス形式で入力してください。";
    }
    if (!formData.subject.trim()) newErrors.subject = "件名を入力してください。";
    if (!formData.message.trim()) newErrors.message = "お問い合わせ内容を入力してください。";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSent(true);
        toast({
          title: "送信が完了しました",
          description: "support@mimihokuro.com 宛にお問い合わせを送信いたしました。自動返信メールをご確認ください。",
          status: "success",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
        setFormData({
          name: "",
          email: "",
          category: "general",
          subject: "",
          message: "",
          website_hp: "",
        });
      } else {
        toast({
          title: "送信エラー",
          description: result.message || "メールの送信に失敗しました。しばらくしてから再度お試しください。",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast({
        title: "通信エラー",
        description: "サーバーとの通信に失敗しました。ネットワーク接続をご確認いただくか、時間をおいてお試しください。",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="max-w-3xl mx-auto font-sans text-notion-text">
      <PageTitle
        pageTitle="✉️ お問い合わせ"
        pageDescription="ご意見・ご感想・新ツールのリクエストやバグの報告など、お気軽にお問い合わせください。"
      />

      <Box mt={8} p={{ base: 5, md: 8 }} border="1px solid" borderColor="#e9e9e7" borderRadius="xl" bg="white" shadow="sm">
        {isSent ? (
          <VStack py={12} gap={4} textAlign="center">
            <PiCheckCircle className="text-6xl text-emerald-600" />
            <Heading size="md" color="gray.800">
              お問い合わせを送信いたしました
            </Heading>
            <Text color="gray.600" maxW="md">
              ご入力いただいたメールアドレス宛に自動確認メールをお送りいたしました。内容を確認の上、担当者よりご連絡いたします。
            </Text>
            <Button
              mt={4}
              bg="#0f7b4b"
              color="white"
              _hover={{ bg: "#196343" }}
              onClick={() => setIsSent(false)}
            >
              新しいお問い合わせを送る
            </Button>
          </VStack>
        ) : (
          <form onSubmit={handleSubmit}>
            <VStack gap={5} align="stretch">
              {/* スパム対策ハニーポット（人間には非表示） */}
              <div style={{ display: "none", opacity: 0, position: "absolute", left: "-9999px" }} aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex="-1"
                  value={formData.website_hp}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* カテゴリ */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">
                  お問い合わせ種別
                </FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  borderColor="#e9e9e7"
                  _focus={{ borderColor: "#0f7b4b", boxShadow: "0 0 0 1px #0f7b4b" }}
                >
                  <option value="general">全般・ご意見・ご感想</option>
                  <option value="request">機能追加・新ツールのリクエスト</option>
                  <option value="bug">バグ・不具合のご報告</option>
                  <option value="business">ビジネス・お仕事に関するご相談</option>
                </Select>
              </FormControl>

              {/* お名前 */}
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">
                  お名前
                </FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  borderColor="#e9e9e7"
                  _focus={{ borderColor: "#0f7b4b", boxShadow: "0 0 0 1px #0f7b4b" }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              {/* メールアドレス */}
              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">
                  メールアドレス
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  borderColor="#e9e9e7"
                  _focus={{ borderColor: "#0f7b4b", boxShadow: "0 0 0 1px #0f7b4b" }}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              {/* 件名 */}
              <FormControl isInvalid={!!errors.subject} isRequired>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">
                  件名
                </FormLabel>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="件名を入力してください"
                  borderColor="#e9e9e7"
                  _focus={{ borderColor: "#0f7b4b", boxShadow: "0 0 0 1px #0f7b4b" }}
                />
                <FormErrorMessage>{errors.subject}</FormErrorMessage>
              </FormControl>

              {/* お問い合わせ内容 */}
              <FormControl isInvalid={!!errors.message} isRequired>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">
                  お問い合わせ内容
                </FormLabel>
                <Textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="具体的な内容やご意見をご記入ください"
                  borderColor="#e9e9e7"
                  _focus={{ borderColor: "#0f7b4b", boxShadow: "0 0 0 1px #0f7b4b" }}
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText="送信中..."
                bg="#0f7b4b"
                color="white"
                size="lg"
                mt={2}
                leftIcon={<PiPaperPlaneTilt />}
                _hover={{ bg: "#196343" }}
              >
                送信する
              </Button>
            </VStack>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Contact;
