import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package, TrendingUp, Users, ShoppingCart } from "lucide-react";
import type { Product, DiscountCode } from "@shared/schema";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      setLocation("/");
    }
  }, [user, isAdmin, setLocation]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif mb-8" data-testid="text-admin-title">
          {t("admin.dashboard")}
        </h1>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" data-testid="tab-products">
              <Package className="w-4 h-4 mr-2" />
              {t("admin.products")}
            </TabsTrigger>
            <TabsTrigger value="discounts" data-testid="tab-discounts">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t("admin.discounts")}
            </TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">
              <Users className="w-4 h-4 mr-2" />
              {t("admin.stats")}
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              {t("admin.settings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountsTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductsTab() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produit supprimé avec succès" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("admin.products")}</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-product">
              <Plus className="w-4 h-4 mr-2" />
              {t("admin.addProduct")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <ProductForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t("common.loading")}</div>
      ) : (
        <div className="grid gap-4">
          {products?.map((product) => (
            <Card key={product.id} data-testid={`card-admin-product-${product.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={product.imageUrl1}
                      alt={product.altTextFr}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <CardTitle>{product.titleFr}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.descriptionFr}
                      </CardDescription>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-semibold">CHF {product.price}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.quantityInStock}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <ProductForm
                          product={editingProduct}
                          onSuccess={() => setEditingProduct(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteProduct.mutate(product.id)}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onSuccess }: { product?: Product | null; onSuccess: () => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titleFr: product?.titleFr || "",
    titleDe: product?.titleDe || "",
    titleEn: product?.titleEn || "",
    descriptionFr: product?.descriptionFr || "",
    descriptionDe: product?.descriptionDe || "",
    descriptionEn: product?.descriptionEn || "",
    price: product?.price || "",
    quantityInStock: product?.quantityInStock || 0,
    discountPercentage: product?.discountPercentage || 0,
    imageUrl1: product?.imageUrl1 || "",
    imageUrl2: product?.imageUrl2 || "",
    altTextFr: product?.altTextFr || "",
    altTextDe: product?.altTextDe || "",
    altTextEn: product?.altTextEn || "",
  });

  const handleImageUpload = async (file: File, imageNumber: 1 | 2) => {
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const data = await response.json();
      const field = imageNumber === 1 ? "imageUrl1" : "imageUrl2";
      setFormData(prev => ({ ...prev, [field]: data.url }));
      toast({ title: `Image ${imageNumber} téléchargée avec succès` });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";
      await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: product ? "Produit mis à jour" : "Produit créé avec succès" });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle data-testid="text-product-form-title">
          {product ? t("admin.editProduct") : t("admin.addProduct")}
        </DialogTitle>
        <DialogDescription>
          Remplissez tous les champs en français, allemand et anglais
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titleFr">Titre (FR)</Label>
              <Input
                id="titleFr"
                value={formData.titleFr}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                required
                data-testid="input-title-fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleDe">Titel (DE)</Label>
              <Input
                id="titleDe"
                value={formData.titleDe}
                onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
                required
                data-testid="input-title-de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (EN)</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
                data-testid="input-title-en"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descFr">Description (FR)</Label>
              <Textarea
                id="descFr"
                value={formData.descriptionFr}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                required
                data-testid="input-desc-fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descDe">Beschreibung (DE)</Label>
              <Textarea
                id="descDe"
                value={formData.descriptionDe}
                onChange={(e) => setFormData({ ...formData, descriptionDe: e.target.value })}
                required
                data-testid="input-desc-de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descEn">Description (EN)</Label>
              <Textarea
                id="descEn"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                required
                data-testid="input-desc-en"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (CHF)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                data-testid="input-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.quantityInStock}
                onChange={(e) => setFormData({ ...formData, quantityInStock: parseInt(e.target.value) })}
                required
                data-testid="input-stock"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Promotion (% réduction)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-discount"
              />
              <p className="text-xs text-muted-foreground">Entre 0 et 100%. Laisser à 0 pour aucune promotion.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image1">Image 1 (principale)</Label>
              <div className="space-y-2">
                <Input
                  id="image1"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 1);
                  }}
                  disabled={uploading}
                  data-testid="input-image1"
                />
                {formData.imageUrl1 && (
                  <div className="relative w-full h-40 border rounded-md overflow-hidden">
                    <img
                      src={formData.imageUrl1}
                      alt="Prévisualisation 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image2">Image 2 (au survol)</Label>
              <div className="space-y-2">
                <Input
                  id="image2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 2);
                  }}
                  disabled={uploading}
                  data-testid="input-image2"
                />
                {formData.imageUrl2 && (
                  <div className="relative w-full h-40 border rounded-md overflow-hidden">
                    <img
                      src={formData.imageUrl2}
                      alt="Prévisualisation 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="altFr">Texte alternatif (FR)</Label>
              <Input
                id="altFr"
                value={formData.altTextFr}
                onChange={(e) => setFormData({ ...formData, altTextFr: e.target.value })}
                required
                data-testid="input-alt-fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altDe">Alternativtext (DE)</Label>
              <Input
                id="altDe"
                value={formData.altTextDe}
                onChange={(e) => setFormData({ ...formData, altTextDe: e.target.value })}
                required
                data-testid="input-alt-de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altEn">Alt text (EN)</Label>
              <Input
                id="altEn"
                value={formData.altTextEn}
                onChange={(e) => setFormData({ ...formData, altTextEn: e.target.value })}
                required
                data-testid="input-alt-en"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending} data-testid="button-save-product">
            {mutation.isPending ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </form>
    </>
  );
}

function DiscountsTab() {
  const { t } = useLanguage();
  const { data: discounts } = useQuery<DiscountCode[]>({
    queryKey: ["/api/discount"],
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{t("admin.discounts")}</h2>
      <div className="grid gap-4">
        {discounts?.map((discount) => (
          <Card key={discount.id}>
            <CardHeader>
              <CardTitle>{discount.code}</CardTitle>
              <CardDescription>
                {discount.type === "PERCENTAGE" ? `${discount.value}%` : `CHF ${discount.value}`}
                {discount.isSingleUse && " (Usage unique)"}
                {!discount.isActive && " (Inactif)"}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: string;
}

function StatsTab() {
  const { t } = useLanguage();
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produits</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commandes</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">CHF {stats?.totalRevenue || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SiteSettings {
  id: string;
  defaultLanguage: string;
  updatedAt: string;
}

function SettingsTab() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setSelectedLanguage(settings.defaultLanguage);
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: async (defaultLanguage: string) => {
      return await apiRequest("PUT", "/api/settings", { defaultLanguage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ 
        title: t("admin.settingsUpdated") || "Paramètres mis à jour avec succès",
        description: t("admin.settingsUpdatedDesc") || "La langue par défaut du site a été modifiée"
      });
    },
    onError: () => {
      toast({ 
        title: t("common.error") || "Erreur",
        description: t("admin.settingsUpdateError") || "Impossible de mettre à jour les paramètres",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    if (selectedLanguage) {
      updateSettings.mutate(selectedLanguage);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.siteSettings")}</CardTitle>
          <CardDescription>{t("admin.siteSettingsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-language">{t("admin.defaultLanguage")}</Label>
            <select
              id="default-language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              data-testid="select-default-language"
            >
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
            <p className="text-sm text-muted-foreground">
              {t("admin.defaultLanguageDesc")}
            </p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={updateSettings.isPending || selectedLanguage === settings?.defaultLanguage}
            data-testid="button-save-settings"
          >
            {updateSettings.isPending ? t("common.loading") : t("common.save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
