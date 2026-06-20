type ArticleLike = {
  tags: string;
  keyTakeaways: string;
  content: string;
  faqJson: string;
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export function articleTags(article: Pick<ArticleLike, "tags">) {
  return article.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function articleTakeaways(article: Pick<ArticleLike, "keyTakeaways">) {
  return article.keyTakeaways
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function articleFaqs(article: Pick<ArticleLike, "faqJson">): ArticleFaq[] {
  try {
    const parsed = JSON.parse(article.faqJson);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is ArticleFaq =>
            typeof item?.question === "string" && typeof item?.answer === "string"
        )
      : [];
  } catch {
    return [];
  }
}

export function articleSections(article: Pick<ArticleLike, "content">): ArticleSection[] {
  return article.content
    .split("\n## ")
    .map((section, index) => (index === 0 ? section.replace(/^##\s*/, "") : section))
    .map((section) => {
      const [heading = "", ...paragraphs] = section.split("\n").map((line) => line.trim());
      return {
        heading,
        paragraphs: paragraphs.filter(Boolean)
      };
    })
    .filter((section) => section.heading.length > 0);
}
