// websiteName.com/new-meetup
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { useRouter } from "next/router";
const NewMeetupPage = () => {
  const router = useRouter();
  const onAddMeetupHandler = async (enteredMeetupData) => {
    // local direction (path)
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    router.push("/");
  };
  return <NewMeetupForm onAddMeetup={onAddMeetupHandler} />;
};
export default NewMeetupPage;
