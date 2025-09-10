import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { 
  doctorsState, 
  servicesState, 
  departmentsState, 
  articlesState,
  schedulesState,
  invoicesState 
} from "@/state";
import Section from "@/components/section";

interface DataItem {
  id: number;
  [key: string]: any;
}

interface DataTableProps {
  title: string;
  data: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (id: number) => void;
}

function DataTable({ title, data, onEdit, onDelete }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getTableHeaders = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500 self-center">
            {filteredData.length} mục
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              {getTableHeaders().map((header) => (
                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {getTableHeaders().map((header) => (
                  <td key={header} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {header === 'image' && item[header] ? (
                      <img src={item[header]} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : header === 'schedule' && item[header] ? (
                      <span className="text-xs">
                        {new Date(item[header].date).toLocaleDateString('vi-VN')} {item[header].time?.hour}:00
                      </span>
                    ) : (
                      <span className="truncate max-w-xs block">
                        {String(item[header]).length > 50 
                          ? String(item[header]).substring(0, 50) + '...'
                          : String(item[header])
                        }
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md text-xs"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('doctors');
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Load data from atoms
  const doctors = useAtomValue(doctorsState);
  const services = useAtomValue(servicesState);
  const departments = useAtomValue(departmentsState);
  const articles = useAtomValue(articlesState);
  const schedules = useAtomValue(schedulesState);
  const invoices = useAtomValue(invoicesState);

  // Simple authorization check (you can enhance this)
  useEffect(() => {
    // For now, just set as authorized if accessing directly
    // In production, you might want to add proper authentication
    setIsAuthorized(true);
  }, []);

  const tabs = [
    { id: 'doctors', label: 'Bác sĩ', data: doctors },
    { id: 'services', label: 'Dịch vụ', data: services },
    { id: 'departments', label: 'Khoa', data: departments },
    { id: 'articles', label: 'Tin tức', data: articles },
    { id: 'schedules', label: 'Lịch khám', data: schedules },
    { id: 'invoices', label: 'Hóa đơn', data: invoices },
  ];

  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      // TODO: Implement delete logic
      console.log('Delete item:', id);
    }
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Save item:', editingItem);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Truy cập bị từ chối</h1>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Trang quản trị:</strong> Đây là trang dành cho quản trị viên. 
                  Chỉ truy cập được qua đường link trực tiếp.
                </p>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản trị dữ liệu MeLinh Hospital</h1>
          <p className="text-gray-600">Quản lý thông tin bác sĩ, dịch vụ, khoa và các dữ liệu khác</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({Array.isArray(tab.data) ? tab.data.length : 0})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Data Table */}
        {currentTab && Array.isArray(currentTab.data) && (
          <DataTable
            title={currentTab.label}
            data={currentTab.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Export/Import Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Xuất/Nhập dữ liệu</h3>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const data = currentTab?.data;
                if (data && Array.isArray(data)) {
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${currentTab.label.toLowerCase()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Xuất JSON
            </button>
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      try {
                        const data = JSON.parse(e.target?.result as string);
                        console.log('Imported data:', data);
                        // TODO: Implement import logic
                        alert('Dữ liệu đã được nhập thành công!');
                      } catch (error) {
                        alert('Lỗi: File JSON không hợp lệ!');
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Nhập JSON
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Chỉnh sửa thông tin</h3>
              <div className="space-y-4">
                {Object.entries(editingItem).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    {key === 'image' ? (
                      <input
                        type="url"
                        value={String(value)}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          [key]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : typeof value === 'object' ? (
                      <textarea
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditingItem({
                              ...editingItem,
                              [key]: parsed
                            });
                          } catch {
                            // Invalid JSON, keep as string
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          [key]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
