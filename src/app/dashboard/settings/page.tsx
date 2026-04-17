export default function SettingsPage() {
  return (
    <main className="p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Cài đặt</h1>
        <p className="text-slate-600 mb-8">
          Trang cấu hình hệ thống thuộc route /dashboard/settings.
        </p>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Thông tin tài khoản</h3>
            <p className="text-sm text-slate-500">Form cập nhật tên, ngày sinh, v.v...</p>
          </div>
          <div className="border border-slate-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Bảo mật</h3>
            <p className="text-sm text-slate-500">Đổi mật khẩu và thiết lập 2 bước (2FA).</p>
          </div>
        </div>
      </div>
    </main>
  )
}
