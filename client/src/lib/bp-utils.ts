export type BPStatus = 'Normal' | 'Elevated' | 'High Stage 1' | 'High Stage 2' | 'Crisis';

export interface BPStatusInfo {
  label: BPStatus;
  colorClass: string;
  textColor: string;
  borderColor: string;
}

export function getBPStatus(systolic: number, diastolic: number): BPStatusInfo {
  if (systolic < 120 && diastolic < 80) {
    return {
      label: 'Normal',
      colorClass: 'bg-emerald-100 dark:bg-emerald-500/20',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-500/30'
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      label: 'Elevated',
      colorClass: 'bg-yellow-100 dark:bg-yellow-500/20',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-500/30'
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      label: 'High Stage 1',
      colorClass: 'bg-orange-100 dark:bg-orange-500/20',
      textColor: 'text-orange-700 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-500/30'
    };
  }
  if (systolic >= 180 || diastolic >= 120) {
    return {
      label: 'Crisis',
      colorClass: 'bg-red-200 dark:bg-red-500/30',
      textColor: 'text-red-900 dark:text-red-400 font-bold animate-pulse',
      borderColor: 'border-red-300 dark:border-red-500/50'
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      label: 'High Stage 2',
      colorClass: 'bg-red-100 dark:bg-red-500/20',
      textColor: 'text-red-700 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-500/30'
    };
  }
  
  return {
    label: 'Normal',
    colorClass: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  };
}
