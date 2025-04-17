
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { FileText, HelpCircle, Send } from "lucide-react";
import Logo from "@/components/Logo";
import ScenarioCard from "@/components/ScenarioCard";
import CharacteristicItem from "@/components/CharacteristicItem";
import ContactForm from "@/components/ContactForm";
import HelpDialog from "@/components/HelpDialog";
import ApplicationPreview from "@/components/ApplicationPreview";
import { DroneConfiguration } from "@/types/drone";
import { scenarios, droneModels, payloadTypes, batteryTypes } from "@/data/scenarios";

const Index = () => {
  const { toast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState("");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [customDescription, setCustomDescription] = useState("");
  const [activeTab, setActiveTab] = useState("configurator");
  
  // Configuration state
  const [configuration, setConfiguration] = useState<DroneConfiguration>({
    scenario: "",
    model: "",
    category: "Средняя",
    flightTime: 45,
    range: 15,
    payloadType: "",
    battery: batteryTypes[0],
    description: "",
    isCustom: false,
    estimatedPrice: {
      min: 500000,
      max: 800000
    }
  });

  const handleScenarioSelect = (scenarioId: string) => {
    const selectedScenarioData = scenarios.find(s => s.id === scenarioId);
    if (selectedScenarioData) {
      setSelectedScenario(scenarioId);
      setConfiguration({
        ...configuration,
        ...selectedScenarioData.defaultConfiguration,
      });
      toast({
        title: "Сценарий выбран",
        description: `Выбран сценарий: ${selectedScenarioData.title}`,
      });
    }
  };

  const handleContactFormSubmit = (data: any) => {
    toast({
      title: "Заявка отправлена",
      description: "Специалист свяжется с вами в ближайшее время",
    });
    setShowContactDialog(false);
    setShowPreviewDialog(false);
  };

  const handleCalculatePrice = () => {
    if (!selectedScenario) {
      toast({
        title: "Выберите сценарий",
        description: "Пожалуйста, выберите сценарий применения",
        variant: "destructive"
      });
      return;
    }
    
    // Update the configuration with any custom description
    if (customDescription) {
      setConfiguration({
        ...configuration,
        description: customDescription,
        isCustom: true,
        estimatedPrice: {
          min: Math.round(configuration.estimatedPrice.min * 1.2),
          max: Math.round(configuration.estimatedPrice.max * 1.2)
        }
      });
    }
    
    setShowPreviewDialog(true);
  };

  const handleGenerateDocument = () => {
    setShowContactDialog(true);
  };

  const handleModelChange = (model: string) => {
    let category = "Средняя";
    if (model.includes("300") || model.includes("250")) {
      category = "Малая";
    } else if (model.includes("600") || model.includes("700")) {
      category = "Тяжелая";
    }
    
    setConfiguration({
      ...configuration,
      model,
      category
    });
  };
  
  const getAvailableModels = () => {
    if (!configuration.scenario) return [];
    return droneModels[configuration.scenario as keyof typeof droneModels] || [];
  };
  
  const getAvailablePayloads = () => {
    if (!configuration.scenario) return [];
    return payloadTypes[configuration.scenario as keyof typeof payloadTypes] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <h1 className="text-lg md:text-xl font-light tracking-wide text-gray-700">
            АВТОНОМНЫЕ АЭРОКОСМИЧЕСКИЕ СИСТЕМЫ
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 mb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="configurator">Конфигуратор</TabsTrigger>
            <TabsTrigger value="custom">Свободная форма</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configurator" className="space-y-8">
            {/* Scenarios Section */}
            <section>
              <h2 className="text-xl font-medium mb-4">Выберите сценарий применения:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    title={scenario.title}
                    description={scenario.description}
                    isActive={selectedScenario === scenario.id}
                    onClick={() => handleScenarioSelect(scenario.id)}
                  />
                ))}
              </div>
            </section>
            
            <Separator />
            
            {/* Characteristics Section */}
            {selectedScenario && (
              <section className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Характеристики:</h2>
                
                <CharacteristicItem 
                  label="Модель БАС" 
                  tooltip="Выберите подходящую модель беспилотной авиационной системы"
                >
                  <Select 
                    value={configuration.model} 
                    onValueChange={handleModelChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите модель" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableModels().map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CharacteristicItem>
                
                <CharacteristicItem 
                  label="Категория" 
                  tooltip="Категория БАС определяется по массе и характеристикам"
                >
                  <RadioGroup 
                    value={configuration.category} 
                    onValueChange={(value) => setConfiguration({...configuration, category: value})}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Малая" id="category-small" />
                      <Label htmlFor="category-small">Малая</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Средняя" id="category-medium" />
                      <Label htmlFor="category-medium">Средняя</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Тяжелая" id="category-large" />
                      <Label htmlFor="category-large">Тяжелая</Label>
                    </div>
                  </RadioGroup>
                </CharacteristicItem>
                
                <CharacteristicItem 
                  label="Время полета" 
                  tooltip="Максимальное время полета на одном заряде аккумулятора"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">15 мин</span>
                      <span className="font-medium">{configuration.flightTime} мин</span>
                      <span className="text-sm">120 мин</span>
                    </div>
                    <Slider
                      min={15}
                      max={120}
                      step={5}
                      value={[configuration.flightTime]}
                      onValueChange={(values) => setConfiguration({...configuration, flightTime: values[0]})}
                    />
                  </div>
                </CharacteristicItem>
                
                <CharacteristicItem 
                  label="Радиус действия" 
                  tooltip="Максимальное расстояние полета от точки взлета"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">1 км</span>
                      <span className="font-medium">{configuration.range} км</span>
                      <span className="text-sm">50 км</span>
                    </div>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={[configuration.range]}
                      onValueChange={(values) => setConfiguration({...configuration, range: values[0]})}
                    />
                  </div>
                </CharacteristicItem>
                
                <CharacteristicItem 
                  label="Полезная нагрузка" 
                  tooltip="Тип оборудования, установленного на БАС"
                >
                  <Select 
                    value={configuration.payloadType} 
                    onValueChange={(value) => setConfiguration({...configuration, payloadType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип полезной нагрузки" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailablePayloads().map((payload) => (
                        <SelectItem key={payload} value={payload}>{payload}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CharacteristicItem>
                
                <CharacteristicItem 
                  label="Аккумулятор" 
                  tooltip="Тип и емкость аккумулятора"
                >
                  <Select 
                    value={configuration.battery} 
                    onValueChange={(value) => setConfiguration({...configuration, battery: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип аккумулятора" />
                    </SelectTrigger>
                    <SelectContent>
                      {batteryTypes.map((battery) => (
                        <SelectItem key={battery} value={battery}>{battery}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CharacteristicItem>
                
                <CharacteristicItem 
                  label="Особые требования" 
                  tooltip="Укажите дополнительные требования или пожелания"
                >
                  <Textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Опишите дополнительные требования к конфигурации..."
                    className="min-h-[80px]"
                  />
                </CharacteristicItem>
              </section>
            )}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-8">
            <section className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4">
                Опишите ваши требования
              </h2>
              <p className="text-gray-600 mb-6">
                Введите ваш запрос, а помощник сформирует вашу заявку:
              </p>
              
              <Textarea
                placeholder="Опишите задачи, которые должен выполнять дрон, условия эксплуатации, требуемую полезную нагрузку и другие важные характеристики..."
                className="min-h-[200px] mb-6"
              />
              
              <Button className="w-full">
                <Send className="mr-2" size={18} />
                Сформировать заявку
              </Button>
            </section>
          </TabsContent>
        </Tabs>
        
        {/* Price and Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-lg font-medium mr-2">Стоимость:</span>
              <span className="text-xl font-bold">
                {selectedScenario 
                  ? `от ${configuration.estimatedPrice.min.toLocaleString()} до ${configuration.estimatedPrice.max.toLocaleString()} руб.`
                  : "Выберите сценарий применения"
                }
              </span>
            </div>
            
            <div className="flex space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileText className="mr-2" size={18} />
                    Пример заявки
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <div className="p-2">
                    <h3 className="text-xl font-medium mb-4">Пример заявки</h3>
                    <p className="mb-4">
                      Пример типовой заявки на БАС для задач инспекции промышленных объектов:
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                      <p className="mb-2"><strong>Клиент:</strong> ООО "ПромИнспект"</p>
                      <p className="mb-2"><strong>Задача:</strong> Регулярный осмотр промышленных трубопроводов на нефтеперерабатывающем заводе</p>
                      <p className="mb-2"><strong>Требования:</strong> Обнаружение утечек, коррозии, деформаций; работа в условиях повышенной температуры; передача данных в реальном времени</p>
                      <p><strong>Комплектация:</strong> БАС Инспектор-400 с тепловизором и камерой высокого разрешения, дополнительные аккумуляторы</p>
                    </div>
                    
                    <p>Ваша заявка будет содержать детальное описание предлагаемого решения, технические характеристики и предварительную стоимость.</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button onClick={handleCalculatePrice}>
                <HelpCircle className="mr-2" size={18} />
                Рассчитать решение
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="sm:max-w-[450px] p-0">
          <HelpDialog 
            onAccept={() => {
              setShowHelpDialog(false);
              toast({
                title: "Активирован помощник",
                description: "Помощник поможет вам настроить параметры БАС",
              });
            }}
            onDecline={() => setShowHelpDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <ApplicationPreview 
            configuration={configuration}
            onRequestDocument={handleGenerateDocument}
          />
        </DialogContent>
      </Dialog>
      
      {/* Contact Form Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <ContactForm 
            onSubmit={handleContactFormSubmit}
            onCancel={() => setShowContactDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
