interface IPostMessageBody {
  name: string;
  phone: string;
  message?: string;
  basket?: string[];
}

interface IPostResponce {
  ok: boolean;
  message: string;
}
