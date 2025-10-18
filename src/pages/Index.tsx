import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ModelViewer3D from '@/components/ModelViewer3D';

const models = [
  { id: 1, name: 'Gear Mechanism', category: 'Mechanical', price: 450, image: '⚙️', complexity: 'Medium', modelType: 'gear' },
  { id: 2, name: 'Geometric Vase', category: 'Decor', price: 320, image: '🏺', complexity: 'Low', modelType: 'vase' },
  { id: 3, name: 'Robot Arm', category: 'Robotics', price: 1200, image: '🦾', complexity: 'High', modelType: 'robot' },
  { id: 4, name: 'Phone Stand', category: 'Accessories', price: 180, image: '📱', complexity: 'Low', modelType: 'phone-stand' },
  { id: 5, name: 'Miniature House', category: 'Architecture', price: 890, image: '🏠', complexity: 'Medium', modelType: 'house' },
  { id: 6, name: 'Dragon Figure', category: 'Art', price: 1500, image: '🐉', complexity: 'High', modelType: 'dragon' },
];

const materials = [
  { name: 'PLA', price: 1.0, strength: 3, flexibility: 2, detail: 4, color: '#0EA5E9' },
  { name: 'ABS', price: 1.2, strength: 4, flexibility: 3, detail: 3, color: '#F97316' },
  { name: 'PETG', price: 1.5, strength: 5, flexibility: 4, detail: 4, color: '#8B5CF6' },
  { name: 'Resin', price: 2.5, strength: 3, flexibility: 1, detail: 5, color: '#D946EF' },
];

const orders = [
  { id: 'ORD-2847', model: 'Gear Mechanism', status: 'printing', progress: 67 },
  { id: 'ORD-2846', model: 'Phone Stand', status: 'completed', progress: 100 },
  { id: 'ORD-2845', model: 'Dragon Figure', status: 'pending', progress: 0 },
];

export default function Index() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [infill, setInfill] = useState([20]);
  const [layerHeight, setLayerHeight] = useState([0.2]);
  const [activeTab, setActiveTab] = useState('catalog');
  const [is3DViewOpen, setIs3DViewOpen] = useState(false);
  const [viewingModel, setViewingModel] = useState(models[0]);
  const [preview3DMaterial, setPreview3DMaterial] = useState(materials[0]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const calculatePrice = () => {
    const basePrice = selectedModel.price;
    const materialMultiplier = selectedMaterial.price;
    const infillMultiplier = 1 + (infill[0] / 100) * 0.3;
    return Math.round(basePrice * materialMultiplier * infillMultiplier);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'printing': return 'bg-primary';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'printing': return 'В печати';
      case 'completed': return 'Завершено';
      case 'pending': return 'В очереди';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="glass-effect border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Cuboid" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                3D Print Pro
              </h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-primary/20"
              onClick={() => setIsProfileOpen(true)}
            >
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8 bg-card/50 p-1 glass-effect">
            <TabsTrigger value="catalog" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Grid3x3" size={18} className="mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Upload" size={18} className="mr-2" />
              Загрузка
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Calculator" size={18} className="mr-2" />
              Расчёт
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Package" size={18} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="UserCircle" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-heading font-bold mb-2">Популярные модели</h2>
              <p className="text-muted-foreground">Выберите готовую модель или загрузите свою</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <Card 
                  key={model.id} 
                  className="overflow-hidden gradient-border hover:scale-105 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    setSelectedModel(model);
                    setActiveTab('calculator');
                  }}
                >
                  <div className="p-6">
                    <div className="text-7xl mb-4 text-center group-hover:animate-float">{model.image}</div>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-heading font-semibold text-lg">{model.name}</h3>
                        <Badge variant="secondary" className="ml-2">{model.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Layers" size={16} />
                          {model.complexity}
                        </div>
                        <div className="text-2xl font-heading font-bold text-primary">
                          {model.price} ₽
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingModel(model);
                          setIs3DViewOpen(true);
                        }}
                      >
                        <Icon name="Eye" size={18} className="mr-2" />
                        Предпросмотр 3D
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="animate-fade-in">
            <Card className="gradient-border p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-glow-pulse">
                  <Icon name="Upload" size={48} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Загрузите свою модель</h2>
                  <p className="text-muted-foreground max-w-md">
                    Поддерживаются форматы: STL, OBJ, 3MF
                    <br />Максимальный размер: 100 МБ
                  </p>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-8">
                  <Icon name="FileUp" size={20} className="mr-2" />
                  Выбрать файл
                </Button>
                <div className="grid grid-cols-3 gap-4 pt-6 w-full max-w-lg">
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-primary">3D</div>
                    <div className="text-sm text-muted-foreground">Форматы</div>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="text-3xl font-heading font-bold text-secondary">100</div>
                    <div className="text-sm text-muted-foreground">МБ макс</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-primary">∞</div>
                    <div className="text-sm text-muted-foreground">Загрузок</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="gradient-border p-6">
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center">
                  <Icon name="Box" size={24} className="mr-2 text-primary" />
                  Выбранная модель
                </h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-9xl mb-4 animate-float">{selectedModel.image}</div>
                    <h4 className="text-2xl font-heading font-bold mb-2">{selectedModel.name}</h4>
                    <Badge variant="outline" className="text-base">{selectedModel.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="glass-effect p-4 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1">Сложность</div>
                      <div className="font-heading font-semibold">{selectedModel.complexity}</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1">Базовая цена</div>
                      <div className="font-heading font-semibold">{selectedModel.price} ₽</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="gradient-border p-6">
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center">
                  <Icon name="Settings" size={24} className="mr-2 text-secondary" />
                  Настройки печати
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Материал</label>
                    <div className="grid grid-cols-2 gap-3">
                      {materials.map((material) => (
                        <Button
                          key={material.name}
                          variant={selectedMaterial.name === material.name ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col items-start ${
                            selectedMaterial.name === material.name 
                              ? 'bg-gradient-to-br from-primary to-secondary border-0' 
                              : ''
                          }`}
                          onClick={() => setSelectedMaterial(material)}
                        >
                          <div className="font-heading font-bold text-lg">{material.name}</div>
                          <div className="text-xs opacity-80">×{material.price} к цене</div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="glass-effect p-4 rounded-lg space-y-2">
                    <div className="text-sm font-medium mb-2">Характеристики материала</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Прочность</span>
                        <Progress value={selectedMaterial.strength * 20} className="w-24 h-2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Гибкость</span>
                        <Progress value={selectedMaterial.flexibility * 20} className="w-24 h-2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Детализация</span>
                        <Progress value={selectedMaterial.detail * 20} className="w-24 h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Заполнение: {infill[0]}%
                    </label>
                    <Slider 
                      value={infill} 
                      onValueChange={setInfill}
                      max={100}
                      step={5}
                      className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground">Влияет на прочность и расход материала</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Высота слоя: {layerHeight[0]} мм
                    </label>
                    <Slider 
                      value={layerHeight} 
                      onValueChange={setLayerHeight}
                      min={0.1}
                      max={0.4}
                      step={0.05}
                      className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground">Меньше = выше качество, дольше печать</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Итоговая стоимость</div>
                        <div className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {calculatePrice()} ₽
                        </div>
                      </div>
                      <Icon name="TrendingUp" size={32} className="text-primary opacity-50" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base">
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      Заказать печать
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-heading font-bold mb-2">Мои заказы</h2>
              <p className="text-muted-foreground">Отслеживайте статус печати в реальном времени</p>
            </div>
            <div className="space-y-4">
              {orders.map((order, index) => (
                <Card 
                  key={order.id} 
                  className="gradient-border p-6 animate-slide-up hover:scale-[1.02] transition-transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Заказ #{order.id}</div>
                      <div className="font-heading font-bold text-xl">{order.model}</div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс печати</span>
                      <span className="font-heading font-semibold">{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} className="h-3" />
                    {order.status === 'printing' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                        <Icon name="Clock" size={16} />
                        Осталось примерно 2.5 часа
                      </div>
                    )}
                    {order.status === 'completed' && (
                      <Button variant="outline" className="w-full mt-2">
                        <Icon name="Download" size={18} className="mr-2" />
                        Скачать отчёт
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold mb-2">Профиль</h2>
                <p className="text-muted-foreground">Управляйте своим аккаунтом и настройками</p>
              </div>

              <div className="grid gap-6">
                <Card className="gradient-border p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-heading font-bold text-white neon-glow">
                      АП
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold mb-2">Алексей Петров</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="Mail" size={16} />
                          alexey.petrov@example.com
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Phone" size={16} />
                          +7 (999) 123-45-67
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} />
                          Москва, Россия
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4">
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать профиль
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="gradient-border p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 flex items-center">
                    <Icon name="BarChart3" size={24} className="mr-2 text-primary" />
                    Статистика заказов
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="glass-effect p-4 rounded-lg text-center">
                      <div className="text-3xl font-heading font-bold text-primary mb-1">12</div>
                      <div className="text-sm text-muted-foreground">Всего заказов</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg text-center">
                      <div className="text-3xl font-heading font-bold text-green-500 mb-1">9</div>
                      <div className="text-sm text-muted-foreground">Завершено</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg text-center">
                      <div className="text-3xl font-heading font-bold text-secondary mb-1">2</div>
                      <div className="text-sm text-muted-foreground">В работе</div>
                    </div>
                    <div className="glass-effect p-4 rounded-lg text-center">
                      <div className="text-3xl font-heading font-bold text-muted mb-1">1</div>
                      <div className="text-sm text-muted-foreground">В очереди</div>
                    </div>
                  </div>
                </Card>

                <Card className="gradient-border p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 flex items-center">
                    <Icon name="History" size={24} className="mr-2 text-secondary" />
                    История заказов
                  </h3>
                  <div className="space-y-3">
                    {[
                      { date: '15 окт 2024', model: 'Gear Mechanism', price: 540, status: 'completed' },
                      { date: '12 окт 2024', model: 'Phone Stand', price: 216, status: 'completed' },
                      { date: '08 окт 2024', model: 'Miniature House', price: 1335, status: 'completed' },
                      { date: '05 окт 2024', model: 'Geometric Vase', price: 384, status: 'completed' },
                      { date: '01 окт 2024', model: 'Dragon Figure', price: 1800, status: 'completed' },
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="glass-effect p-4 rounded-lg flex items-center justify-between hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Icon name="Package" size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-heading font-semibold">{item.model}</div>
                            <div className="text-sm text-muted-foreground">{item.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-heading font-bold text-primary">{item.price} ₽</div>
                          <Badge variant="outline" className="mt-1">
                            <Icon name="Check" size={12} className="mr-1" />
                            Завершено
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="gradient-border p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 flex items-center">
                    <Icon name="Settings" size={24} className="mr-2 text-primary" />
                    Настройки
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Bell" size={20} className="text-muted-foreground" />
                        <div>
                          <div className="font-medium">Уведомления о заказах</div>
                          <div className="text-sm text-muted-foreground">Получать обновления по email</div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-lg"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="MessageSquare" size={20} className="text-muted-foreground" />
                        <div>
                          <div className="font-medium">SMS-уведомления</div>
                          <div className="text-sm text-muted-foreground">Статус печати на телефон</div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-lg"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Sparkles" size={20} className="text-muted-foreground" />
                        <div>
                          <div className="font-medium">Рекомендации моделей</div>
                          <div className="text-sm text-muted-foreground">Персональные предложения</div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="gradient-border p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 flex items-center">
                    <Icon name="CreditCard" size={24} className="mr-2 text-secondary" />
                    Способы оплаты
                  </h3>
                  <div className="space-y-3">
                    <div className="glass-effect p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <div className="font-medium">•••• 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/25</div>
                        </div>
                      </div>
                      <Badge variant="outline">По умолчанию</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить карту
                    </Button>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Icon name="HelpCircle" size={18} className="mr-2" />
                    Поддержка
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10">
                    <Icon name="LogOut" size={18} className="mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={is3DViewOpen} onOpenChange={setIs3DViewOpen}>
        <DialogContent className="max-w-4xl glass-effect border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading flex items-center gap-3">
              <span className="text-4xl">{viewingModel.image}</span>
              <div>
                <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {viewingModel.name}
                </div>
                <div className="text-sm text-muted-foreground font-normal mt-1">
                  Вращайте мышью • Зум колёсиком
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ModelViewer3D modelType={viewingModel.modelType} color={preview3DMaterial.color} />
            <div className="glass-effect p-4 rounded-lg mt-4">
              <div className="text-sm font-medium mb-3 flex items-center justify-between">
                <span>Материал для предпросмотра</span>
                <Badge variant="outline" className="font-heading">{preview3DMaterial.name}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {materials.map((material) => (
                  <button
                    key={material.name}
                    onClick={() => setPreview3DMaterial(material)}
                    className={`h-12 rounded-lg border-2 transition-all ${
                      preview3DMaterial.name === material.name
                        ? 'border-white scale-105 shadow-lg'
                        : 'border-border/50 hover:border-border hover:scale-102'
                    }`}
                    style={{ backgroundColor: material.color }}
                  >
                    <div className="text-xs font-semibold text-white drop-shadow-lg">
                      {material.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="glass-effect p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Категория</div>
                <div className="font-heading font-semibold">{viewingModel.category}</div>
              </div>
              <div className="glass-effect p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Сложность</div>
                <div className="font-heading font-semibold">{viewingModel.complexity}</div>
              </div>
              <div className="glass-effect p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Цена</div>
                <div className="font-heading font-semibold text-primary">{viewingModel.price} ₽</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button 
                variant="outline"
                className="h-12 text-base"
                onClick={() => {
                  setSelectedModel(viewingModel);
                  setSelectedMaterial(preview3DMaterial);
                  setActiveTab('calculator');
                  setIs3DViewOpen(false);
                }}
              >
                <Icon name="Settings" size={20} className="mr-2" />
                Настроить печать
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base"
                onClick={() => {
                  setSelectedModel(viewingModel);
                  setSelectedMaterial(preview3DMaterial);
                  setIs3DViewOpen(false);
                }}
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Заказать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}