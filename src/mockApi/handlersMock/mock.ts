import { MockHandler } from "vite-plugin-simple-json-server";
const genToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
let token = genToken();

export const getMockHandlers = (): MockHandler[] => ([
	{
		pattern: '/api/login',
		method: "POST",
		handle: (req, res) => {
			let body: string | {username: string, password: string}="";
			req.on('data', (chunk:string) => {
				body += chunk;
			})

			req.on('end', () => {
				body = JSON.parse(body as string) as { username: string, password: string };
				// if ((body?.username === env.VITE_USERNAME && body?.password === env.VITE_PASSWORD)) {
					res.setHeader('content-type', 'text/html');
					res.writeHead(200,"");
					res.write(token);
					res.end();
				// } else {
				// 	res.setHeader('content-type', 'application/json');
				// 	res.writeHead(401,"Unauthorized");
				// 	res.end(JSON.stringify({code:401, message:"Unauthorized"}));
				// }
			})
		}
	},
	{
		pattern: '/api/getUser',
		method: "GET",
		handle: (req, res) => {
			if (!req.headers.authorization || req.headers.authorization !== token) {
				res.setHeader('content-type', 'application/json');
				res.writeHead(401, "Unauthorized");
				res.end(JSON.stringify({ code: 401, message: "Unauthorized" }));
			} else {
				res.setHeader('content-type', 'application/json');
				const user = {
					nome: "Admin",
					cognome: "Root",
					cf: "CFROOT",
				}
				res.end(JSON.stringify(user));
			}
		}
	},
	{
		pattern: '/api/logout',
		method: "GET",
		handle: (req, res) => {
			res.setHeader('content-type', 'text/html');
			token = genToken();
			res.writeHead(200,"");
			res.end("OK");
		}
	},
	{
		pattern: '/api/**/*',
		handle: (req, res) => {
			//@ts-ignore
			req.locals.next();
		}
	}
]);
