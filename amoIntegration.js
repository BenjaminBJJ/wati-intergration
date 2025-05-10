import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const fetchAccountInfo = async () => {
  const subdomain = process.env.AMOCRM_SUBDOMAIN;
  const accessToken = process.env.AMOCRM_ACCESS_TOKEN;

  if (!subdomain || !accessToken) {
    console.error(
      "❌ Проверь .env: не указаны AMOCRM_SUBDOMAIN или AMOCRM_ACCESS_TOKEN"
    );
    return;
  }

  const url = `https://${subdomain}.amocrm.ru/api/v4/account`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "amoCRM-oAuth-client/1.0",
      },
    });

    const status = response.status;

    const errors = {
      400: "Bad request",
      401: "Unauthorized — проверь access_token или права интеграции",
      403: "Forbidden",
      404: "Not found",
      500: "Internal server error",
      502: "Bad gateway",
      503: "Service unavailable",
    };

    if (status < 200 || status > 204) {
      const message = errors[status] || "Undefined error";
      throw new Error(`${message} (Код ошибки: ${status})`);
    }

    const data = await response.json();
    console.log("✅ Успешный ответ от amoCRM:", data);
    return data;
  } catch (err) {
    console.error("❌ Ошибка при запросе к amoCRM:", err.message);
  }
};

fetchAccountInfo();
