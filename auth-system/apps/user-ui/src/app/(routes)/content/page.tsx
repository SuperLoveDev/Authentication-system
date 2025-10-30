"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Content = () => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

  // handle scroll function
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // logout mutation function
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/logout-user`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("User successfully Logout");
      router.push("/login");
    },
  });

  return (
    <div className="w-full h-full py-10">
      <div
        className={`flex justify-end px-4 pb-10 ${
          isSticky
            ? "fixed top-0 left-0 right-0 bg-slate-500/30 backdrop-blur-2xl z-50 py-4"
            : ""
        }`}
      >
        <button
          type="button"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
          className="w-[200px] bg-purple-600 hover:bg-purple-900 px-2 rounded-full h-[50px] text-gray-300 text-xl font-medium"
        >
          Logout
        </button>
      </div>

      <h1 className="text-center text-3xl text-gray-300 mt-20">
        welcome to your Authentication Blog
      </h1>
      <div className="w-full px-2 my-10">
        <p className="text-gray-200 text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis nulla
          hic, consectetur at magni, dolor explicabo quos rerum eos recusandae
          dignissimos harum, sint iure dolore cumque libero! Reiciendis,
          obcaecati ullam ut quae ipsum nam sit quaerat iusto? Accusantium,
          facilis dicta dolore veniam eligendi rem architecto ea ratione saepe
          vitae voluptates nam, ab et sapiente impedit corrupti minus dolorem,
          dolorum pariatur reprehenderit inventore officiis! Eos repudiandae
          libero, velit facere modi fuga animi magnam soluta iusto explicabo,
          dignissimos quos perspiciatis ducimus molestias ad perferendis culpa
          illum illo mollitia obcaecati laudantium omnis quibusdam ipsa? Placeat
          deleniti alias sequi voluptatibus hic est atque! Explicabo?
        </p>

        <p className="text-gray-300 mt-5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis qui
          omnis, consequuntur dolores tempora ut ad maiores provident iste porro
          at praesentium. Quibusdam aut excepturi, minima cumque fuga itaque hic
          dolor neque aperiam quasi dolorem recusandae molestiae quod pariatur
          facilis, doloremque consectetur deserunt sed perferendis aliquid
          nulla, sunt necessitatibus quos laboriosam. Sequi cumque vel aut
          aliquid voluptatum ea amet maiores, neque ab libero nemo alias
          delectus fugiat, nisi eius pariatur modi. Repellat molestiae laborum
          quae, vero sed, beatae excepturi voluptates sapiente, officia
          consequuntur ea amet! Voluptatem optio natus error, laborum sed nam in
          provident obcaecati autem iure ad tenetur eum temporibus, id aperiam?
          Ex recusandae, aut expedita praesentium excepturi maxime totam at odit
          veritatis non dolor! Impedit magni temporibus laborum atque sed,
          aperiam rerum numquam asperiores commodi! Laboriosam quos, laborum ex
          saepe, esse placeat magni dolor optio nemo laudantium, exercitationem
          corporis earum totam amet fuga accusamus commodi doloribus animi!
          Excepturi repellendus commodi delectus illum nemo odit nam labore
          assumenda voluptatem aut reiciendis mollitia beatae perferendis quis
          ipsum, neque dolor quia necessitatibus corporis, incidunt possimus
          aspernatur, impedit maiores voluptate. Quam harum et, alias ipsa optio
          dolores animi totam dolorum molestiae quibusdam. Ipsa provident magnam
          veniam ipsam vitae perspiciatis omnis assumenda accusantium? Animi
          iste minima obcaecati quia, aspernatur, cupiditate id quo sed
          explicabo consequatur eveniet odio velit impedit libero vitae. Nulla
          nisi, ullam quisquam ipsum, molestias iusto veniam sequi minima
          possimus qui rem aliquam. Quis hic eligendi commodi quia placeat
          dolore fugiat sint odit. Porro deserunt velit numquam tempore expedita
          ullam vitae exercitationem eaque odio ab maxime ea id, eius hic,
          beatae praesentium perferendis ad sequi placeat mollitia itaque ipsa
          voluptatem voluptate quia. Neque quasi mollitia tempore, iusto maxime,
          ad quo culpa fugit eligendi, delectus odit? Molestias sunt ratione
          sequi vero. Ab dignissimos laboriosam pariatur est accusamus quam
          repudiandae reprehenderit aliquam similique deserunt dolorem qui at
          consequatur repellendus quisquam veritatis odit suscipit,
          exercitationem facere obcaecati sequi iste! Nemo quo modi soluta
          quisquam ipsum repudiandae quae facere, maiores repellendus! Eos, eius
          facilis animi placeat amet autem eveniet cupiditate rerum earum
          praesentium repudiandae quae voluptas aspernatur inventore, quia odit
          quidem maiores? Deserunt, delectus. Nostrum quisquam tenetur veniam
          totam illum fugit dolorum pariatur in blanditiis neque ipsa
          consectetur, maxime sit ratione aperiam voluptatibus quo culpa! Ut
          dolorem necessitatibus omnis veritatis illo, a quo sed ipsum
          asperiores tempora voluptatem aut dolores numquam praesentium veniam
          in quisquam ex maiores quis doloremque et hic iusto minus itaque! Vel.
        </p>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="w-[330px] flex justify-center items-center  gap-2 bg-purple-600 rounded-full h-[60px]">
          <ThumbsUpIcon size={35} color="white" />
          <span className="text-gray-200 text-2xl">
            Thank you for attention
          </span>
        </div>
      </div>
    </div>
  );
};

export default Content;
