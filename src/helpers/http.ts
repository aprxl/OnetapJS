import spagent from "superagent";

interface list {
  [key: string]: string;
}

export default class http_manager {
  public constructor(private base_url: string, private key = "") {}

  public get(path: string, headers: list = {}): Promise<spagent.Response> {
    const request = spagent.get(`${this.base_url}/${path}/`);

    for (const [header, value] of Object.entries(headers)) {
      request.set(header, value);
    }

    return new Promise((resolve) => {
      request.end((_, res) => {
        resolve(res);
      });
    });
  }

  public post(
    path: string,
    fields: list = {},
    headers: list = {}
  ): Promise<spagent.Response> {
    const request = spagent.post(`${this.base_url}/${path}/`);

    for (const [header, value] of Object.entries(headers)) {
      request.set(header, value);
    }

    request.send(fields);

    return new Promise((resolve) => {
      request.end((_, res) => {
        resolve(res);
      });
    });
  }

  public delete(
    path: string,
    fields: list = {},
    headers: list = {}
  ): Promise<spagent.Response> {
    const request = spagent.delete(`${this.base_url}/${path}/`);

    for (const [header, value] of Object.entries(headers)) {
      request.set(header, value);
    }

    request.send(fields);

    return new Promise((resolve) => {
      request.end((_, res) => {
        resolve(res);
      });
    });
  }
}
