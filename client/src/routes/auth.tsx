import axios from "axios"
import {Lock, LockOpen} from "lucide-react"
import {useState, useEffect} from "react"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"


export default function Auth(){

    const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [signInPasswordEncryption, setSignInPasswordEncryption] = useState<boolean>(true)
    const [signUpPasswordEncryption, setSignUpPasswordEncryption] = useState<boolean>(true)
    const [signUpConfirmPasswordEncryption, setSignUpConfirmPasswordEncryption] = useState<boolean>(true)
    const [placeholder, setPlaceholder] = useState<string>("BlackRaven")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const [matchingPassword,setMatchingPassword] = useState<boolean>(true)
    
    const usernameEmailValidity:boolean = (emailRegex.test(usernameOrEmail) || usernameRegex.test(usernameOrEmail)) || usernameOrEmail == ""

    useEffect(()=>{ setMatchingPassword(password == confirmPassword)},[confirmPassword])
    useEffect(()=>{console.log(confirmPassword)},[confirmPassword])

    const handleSubmit = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>, usernameOrEmail:string, password:string,mode:string) =>{
      if(!usernameEmailValidity){
        return;
      }
      if(usernameOrEmail=="" || password==""){
        alert("Enter credentials")
        return;
      }
      e.preventDefault();
      try{
        const res = axios.post("http://localhost:8080/auth",
          {
            usernameOrEmail:usernameOrEmail,
            password:password,
            mode:mode                                       
          }
        );
      }catch(err:unknown){
        if (err instanceof Error) {
          // Show the backend's error message
          alert(err.message || "An error occurred");
        } else {
          console.error(err);
          alert("something went wrong i dont know what but something went wrong");
        }
      }
    } 

      setInterval(()=>{
        setPlaceholder((placeholder == "BlackRaven")?"blackraven@gmail.com":"BlackRaven")
      },5000)

    return(
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="SignIn">
        <TabsList>
          <TabsTrigger value="SignIn">SignIn</TabsTrigger>
          <TabsTrigger value="SignUp">SignUp</TabsTrigger>
        </TabsList>
        <TabsContent value="SignIn">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                <h6>Welcome Back</h6>
                <p>Login using ur credentials</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="usernameOrEmail">Username Or Email</Label>
                <Input 
                  required
                  id="usernameOrEmail" 
                  placeholder={placeholder} 
                  onChange={(e)=> setUsernameOrEmail(e.target.value)}/>
                {!usernameEmailValidity && <p>Enter correctly</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  required
                  id="password" 
                  type={(signInPasswordEncryption == false)?"text":"password"}
                  placeholder="qwerty123@"
                  onChange={(e)=>setPassword(e.target.value)}>
                </Input>
                <Button 
                  onClick={ ()=>{setSignInPasswordEncryption(!signInPasswordEncryption)}}
                  className="">
                    {((signInPasswordEncryption == false)?<LockOpen/>:<Lock/>)}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={(e)=>{handleSubmit(e,usernameOrEmail,password,"signIn")}}
              >Sign In</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="SignUp">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                <h6>Welcome</h6>
                <p> Create your new account and join u sin our new journey</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="usernameOrEmail">Username Or Email</Label>
                <Input 
                  required
                  id="usernameOrEmail" 
                  placeholder={placeholder}
                  onChange={(e)=> setUsernameOrEmail(e.target.value)}/>
                  {!usernameEmailValidity && <p>Enter correctly</p>}
              </div>
              <div className="grid gap-3 flex ">
                <Label htmlFor="password">Password</Label>
                <Input 
                  required
                  id="password" 
                  type={(signUpPasswordEncryption == false)?"text":"password"}
                  placeholder="qwerty123@"
                  onChange={(e)=>setPassword(e.target.value)}>
                </Input>
                  <Button 
                    onClick={ ()=>{setSignUpPasswordEncryption(!signUpPasswordEncryption)}}
                    className="">
                      {((signUpPasswordEncryption == false)?<LockOpen/>:<Lock/>)}
                  </Button> 
              </div>
              <div className="grid gap-3 flex">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  required
                  id="confirmPassword" 
                  type={(signUpConfirmPasswordEncryption == false)?"text":"password"}
                  placeholder="qwerty123@"
                  onChange={(e)=>setConfirmPassword(e.target.value)}>
                </Input>
                  <Button 
                    onClick={ ()=>{setSignUpConfirmPasswordEncryption(!signUpConfirmPasswordEncryption)}}
                    className="">
                      {((signUpConfirmPasswordEncryption == false)?<LockOpen/>:<Lock/>)}
                  </Button>
                {!matchingPassword && <p>Passwords dont match. Enter correctly</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={(e)=>{handleSubmit(e,usernameOrEmail,password,"signUp")}}
              >Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        </Tabs>
    </div>
    )
}