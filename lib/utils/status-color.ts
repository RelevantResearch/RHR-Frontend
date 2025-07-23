
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};


export const viewStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-orange-50 text-orange-700 border border-orange-200/60 hover:bg-orange-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-200';
      case 'on_hold':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-200';
      case 'completed':
        return 'bg-violet-50 text-violet-700 border border-violet-200/60 hover:bg-violet-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-200';
      case 'archived':
        return 'bg-slate-50 text-slate-700 border border-slate-200/60 hover:bg-slate-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-gray-200';
    }
  };