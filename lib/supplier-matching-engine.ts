export type SupplierCandidate = {
  id: string;
  categoryMain: string;
  servicesOffered: string[];
  coveredProvinces: string[];
  coveredRegions: string[];
  minimumBudget: number | null;
  reputationScore: number;
  responseQualityScore: number;
  availabilityScore: number;
};

export type SupplierOpportunityInput = {
  serviceType: string;
  province?: string;
  region?: string;
  budget: number | null;
  urgency?: "bassa" | "media" | "alta";
  userConsentToShare: boolean;
};

export type SupplierMatch = {
  supplierId: string;
  compatibilityScore: number;
  canShareContact: boolean;
  reasons: string[];
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function normalized(value?: string | null) {
  return (value ?? "").toLowerCase().trim();
}

export function matchSuppliers(input: SupplierOpportunityInput, suppliers: SupplierCandidate[]): SupplierMatch[] {
  return suppliers
    .map((supplier) => {
      const categoryMatch =
        normalized(supplier.categoryMain).includes(normalized(input.serviceType)) ||
        supplier.servicesOffered.some((service) => normalized(service).includes(normalized(input.serviceType)))
          ? 1
          : 0;

      if (!categoryMatch) return null;

      const provinceMatch = input.province && supplier.coveredProvinces.map(normalized).includes(normalized(input.province)) ? 1 : 0;
      const regionMatch = input.region && supplier.coveredRegions.map(normalized).includes(normalized(input.region)) ? 0.75 : 0;
      const geographyMatch = Math.max(provinceMatch, regionMatch);

      if (!geographyMatch) return null;

      const budgetFit = !input.budget || !supplier.minimumBudget ? 0.7 : input.budget >= supplier.minimumBudget ? 1 : 0.35;
      const serviceSpecificMatch = supplier.servicesOffered.some((service) => normalized(service) === normalized(input.serviceType)) ? 1 : 0.72;
      const reputationScore = clamp01(supplier.reputationScore / 100);
      const responseQualityScore = clamp01(supplier.responseQualityScore / 100);
      const availabilityScore = clamp01(supplier.availabilityScore / 100);

      const compatibilityScore =
        0.3 * categoryMatch +
        0.2 * geographyMatch +
        0.15 * serviceSpecificMatch +
        0.1 * budgetFit +
        0.1 * reputationScore +
        0.1 * responseQualityScore +
        0.05 * availabilityScore;

      const reasons = [
        "categoria compatibile",
        provinceMatch ? "zona precisa coperta" : "regione coperta",
        budgetFit >= 1 ? "budget compatibile" : "budget da verificare",
        responseQualityScore > 0.7 ? "risposte precedenti utili" : "profilo da valutare"
      ];

      return {
        supplierId: supplier.id,
        compatibilityScore: Math.round(compatibilityScore * 100),
        canShareContact: input.userConsentToShare,
        reasons
      };
    })
    .filter((match): match is SupplierMatch => Boolean(match))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
