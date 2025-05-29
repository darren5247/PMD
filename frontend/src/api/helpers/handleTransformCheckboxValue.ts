export const handleTransformBoolean = (value: boolean) => {
 switch (value) {
  case true:
   return 'Yes';
  default:
   return 'No';
 }
};

export const handleTransformString = (value: string) => {
 switch (value) {
  case 'Yes':
   return true;
  default:
   return false;
 }
};
