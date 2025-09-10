import FabForm from "@/components/form/fab-form";
import SymptomInquiry from "@/components/form/symptom-inquiry";
import { bookingFormState, addBookingAtom, userState } from "@/state";
import { promptJSON, wait } from "@/utils/miscellaneous";
import { useAtom, useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Step2() {
  const [formData, setFormData] = useAtom(bookingFormState);
  const [, addBooking] = useAtom(addBookingAtom);
  const { userInfo } = useAtomValue(userState);
  const navigate = useNavigate();

  return (
    <FabForm
      fab={{
        children: "Đặt lịch khám",
        disabled:
          !formData.symptoms.length || !formData.description.trim().length,
        onDisabledClick() {
          toast.error("Vui lòng điền đầy đủ thông tin!");
        },
      }}
      onSubmit={async () => {
        await wait(1500);
        
        // Create new booking
        if (formData.doctor && formData.department && formData.slot) {
          const newBooking = {
            status: "Đang chờ xác nhận",
            patientName: userInfo.name,
            schedule: formData.slot,
            doctor: formData.doctor,
            department: formData.department,
          };
          
          // Add to bookings state
          addBooking(newBooking);
          
          // Show success message
          toast.success("Đặt lịch thành công!");
          
          // Debug: show JSON
          promptJSON(formData);
        }
        
        navigate("/booking/3", {
          viewTransition: true,
        });
      }}
    >
      <SymptomInquiry value={formData} onChange={setFormData} />
    </FabForm>
  );
}
