'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/lib/cropImage'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    studioName: '',
    workspaceArea: '',
    logoFile: null as File | null,
  })

  // State for image cropping
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)
  
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string)
        setIsCropping(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = useCallback((croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (croppedImage) {
        setFormData({ ...formData, logoFile: croppedImage })
        const pUrl = URL.createObjectURL(croppedImage)
        setPreviewUrl(pUrl)
        setIsCropping(false)
      }
    } catch (e) {
      console.error("Erro a recortar: ", e)
    }
  }
  
  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Não autenticado")

      let logoUrl = null
      
      if (formData.logoFile) {
        const fileExt = formData.logoFile.name.split('.').pop()
        const filePath = `${user.id}-${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('branding')
          .upload(filePath, formData.logoFile)
          
        if (uploadError) throw uploadError
        
        const { data } = supabase.storage.from('branding').getPublicUrl(filePath)
        logoUrl = data.publicUrl
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          studio_name: formData.studioName,
          workspace_area: formData.workspaceArea,
          logo_url: logoUrl,
          onboarding_completed: true
        })
        .eq('id', user.id)

      if (profileError) throw profileError
      
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error("ERRO SUPABASE: ", error)
      let errorMsg = "Não foi possível concluir a configuração."
      if (error?.message) errorMsg += `\nDetalhe: ${error.message}`
      else if (error?.error) errorMsg += `\nDetalhe: ${error.error}`
      
      alert(`${errorMsg}\n\nVerifique se o bucket de storage 'branding' existe e é público no seu painel do Supabase. Verifique também se tem as permissões RLS ativas para INSERT/UPDATE na tabela profiles.\nPressione OK para tentar de novo ou continue sem foto.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-card-subtle bg-surface">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Configuração Inicial</CardTitle>
          <CardDescription>
            {step === 1 && "Qual é o nome do seu estúdio ou agência?"}
            {step === 2 && "Qual é a sua área principal de trabalho?"}
            {step === 3 && "Faça upload do seu logótipo opcionalmente."}
          </CardDescription>
          <div className="flex gap-1 mt-4">
            <div className={`h-1.5 w-full rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-full rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-full rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Estúdio</Label>
                <Input 
                  value={formData.studioName} 
                  onChange={e => setFormData({...formData, studioName: e.target.value})}
                  placeholder="Ex: Studio Neo"
                  className="bg-white"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Área de Trabalho</Label>
                <Select 
                  value={formData.workspaceArea} 
                  onValueChange={val => setFormData({...formData, workspaceArea: val})}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="fotografia">Fotografia</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logótipo (Opcional)</Label>
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-4 py-6 bg-white border rounded-md">
                    <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 shadow-sm" />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setPreviewUrl(null)
                        setFormData({...formData, logoFile: null})
                      }}
                    >
                      Remover Imagem
                    </Button>
                  </div>
                ) : (
                  <Input 
                    type="file" 
                    accept="image/*"
                    className="bg-white cursor-pointer"
                    onChange={onFileChange}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || loading}>
            Voltar
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext} disabled={(step === 1 && !formData.studioName) || (step === 2 && !formData.workspaceArea)}>
              Seguinte
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading} className="bg-primary hover:bg-primary-light text-primary-foreground min-w-24">
              {loading ? "A Guardar..." : "Concluir"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isCropping} onOpenChange={(open) => {
        if (!open) setIsCropping(false)
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recortar Imagem</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px] bg-black/5 rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="py-2">
            <Label className="mb-2 block">Zoom</Label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropping(false)}>Cancelar</Button>
            <Button onClick={handleSaveCrop}>Aplicar Recorte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
