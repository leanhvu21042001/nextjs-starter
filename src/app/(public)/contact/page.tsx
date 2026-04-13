import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với N-Starter Team để nhận hỗ trợ tích hợp DataGrid và Clean Architecture.',
}

export default function ContactPage() {
  return (
    <main className="py-24 px-6 lg:px-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Liên hệ</h2>
      <p className="text-slate-600 mb-8">
        Một ví dụ về Form sử dụng lại các Atom (Input, Label, Button) trong public page.
      </p>

      <form className="flex flex-col gap-6" action="#">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first-name">Họ</Label>
            <Input id="first-name" placeholder="Nguyễn" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last-name">Tên</Label>
            <Input id="last-name" placeholder="Văn A" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="example@gmail.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Nội dung</Label>
          <textarea
            id="message"
            rows={4}
            className="flex w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Bạn cần hỗ trợ gì?"
          />
        </div>
        <Button type="button">Gửi đi</Button>
      </form>
    </main>
  )
}
