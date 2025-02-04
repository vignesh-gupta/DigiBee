import PaymentStatus from "@/components/PaymentStatus";
import { getPayloadClient } from "@/get-payload";
import { S3_URL } from "@/lib/constants";
import { getServerSideUser } from "@/lib/payload-utlis";
import { formatPrice, getLabel } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload-types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DownloadButton from "./_component/download-button";

type ThankYouPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const ThankYouPage = async ({ searchParams }: ThankYouPageProps) => {
  const orderId = searchParams.orderId;

  const nextCookies = await cookies();
  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;

  if (!order) return notFound();

  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;
  if (orderUserId !== user?.id) {
    redirect("/sign-in?origin=/thank-you?orderId=" + orderId);
  }

  const products = order.products as Product[];
  const orderTotal = products.reduce(
    (total, product) => total + product.price,
    0
  );

  await payload.update({
    collection: "cart",
    where: {
      user: {
        equals: typeof user === "string" ? user : user.id,
      },
    },
    data: {
      products: [],
    },
  });

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          src="/checkout-thank-you.jpg"
          fill
          alt="Thank you"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-8 xl:gap-x-24">
        <div className="lg:col-start-2 ">
          <p className="text-sm font-medium text-blue-600">Order Successful</p>
          <h1 className="mt-2 text-4xl font-bold text-foreground/90 sm:text-5xl">
            Thank you for ordering!
          </h1>

          {order._isPaid ? (
            <p className="text-muted-foreground mt-2 text-base">
              Your order is processed and your assets are available to download
              below. We&apos;ve also sent receipt to{" "}
              {typeof order.user !== "string" ? (
                <span className="font-medium text-foreground/90">
                  {order.user.email}
                </span>
              ) : null}
              .
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order and we are currently processing it. So
              hang tight, we&apos;ll send you confirmation very soon.
            </p>
          )}

          <div className="mt-1.5 text-sm font-medium flex gap-2">
            <p className="text-muted-foreground">Order No. :</p>
            <p className="text-foreground/90">{orderId}</p>
          </div>

          <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
            {(order.products as Product[]).map((product) => {
              const label = getLabel(product.category);

              const downloadLink = `${S3_URL}/product_files/${
                (product.product_files as ProductFile).filename
              }`;

              const { image } = product.images[0];

              return (
                <li
                  key={`order-product-${product.id}`}
                  className="flex space-x-6 py-6"
                >
                  <div className="relative h-24 w-24">
                    {typeof image !== "string" && image.url ? (
                      <Image
                        src={`${S3_URL}/media/${image.filename}`}
                        fill
                        alt={product.name}
                        className="flex-none rounded-md bg-gray-100 object-cover object-center"
                      />
                    ) : null}
                  </div>

                  <div className="flex-auto flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-foreground/90">{product.name}</h3>

                      <p className="my-1">Category {label}</p>
                    </div>

                    {order._isPaid && (
                      <DownloadButton
                        downloadLink={downloadLink}
                        productName={product.name}
                      />
                    )}
                  </div>

                  <p className="flex-none font-medium text-foreground/90">
                    {formatPrice(product.price)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="text-foreground/90">{formatPrice(orderTotal)}</p>
            </div>

            <div className="flex justify-between">
              <p>Transaction Fee</p>
              <p className="text-foreground/90">{formatPrice(1)}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-foreground/90">
              <p className="text-base">Total</p>
              <p className="text-base">{formatPrice(orderTotal + 1)}</p>
            </div>
          </div>

          <PaymentStatus
            orderEmail={(order.user as User).email}
            isPaid={order._isPaid}
            orderId={order.id}
          />

          <div className="mt-16 border-t border-gray-100 text-right">
            <Link
              className="text-sm text-blue-600 font-medium hover:text-blue-500"
              href="/products"
            >
              Continue shopping &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
