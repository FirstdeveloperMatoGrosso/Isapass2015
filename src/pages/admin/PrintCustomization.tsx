
import { PrintCustomization } from "@/components/admin/PrintCustomization";

const PrintCustomizationPage = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Personalização de Impressão
        </h2>
        <p className="text-muted-foreground">
          Configure as opções de impressão para comprovantes e relatórios
        </p>
      </div>
      <PrintCustomization />
    </div>
  );
};

export default PrintCustomizationPage;
