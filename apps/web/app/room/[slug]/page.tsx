import axios from "axios";
import RoomChat from "../../components/RoomChat";

const BACKEND_URL = 'http://localhost:4000';
export async function getRoomId(slug: string) {
    console.log('slug is ', slug);
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`, {
        headers: {
            authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4YWQzMDVjLTcyYmYtNGU3Mi05YjM0LWM2NDYxNmViOGRmOCIsInVzZXJuYW1lIjoic2hhbmRpbHlhLnJpc2hhYmgxMTdAZ21haWwuY29tIiwicGhvdG8iOm51bGwsImlhdCI6MTc2NTM3Nzc4Mn0.tyesjiKPxgN6W7uxE5j2lWNs0sS7ervjfamiO6iwWAw'
        }
    });
    console.log('response for roomId', response);
    return response;
}

const page = async({params}:{params:{slug:string}}) => {
    console.log('params ', await params);
    const roomId = (await params).slug;
    
    const roomData = await getRoomId(roomId);
    console.log('roomData is ', roomData);

  return (
      <div>page
          <RoomChat roomId={roomData.data.data || ''}></RoomChat>
    </div>
  )
}

export default page