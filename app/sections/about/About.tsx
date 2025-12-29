import { AnimationWrapper } from "@/app/components/AnimationWrapper";
import { Stats } from "@/app/components/Stats";
import { getAboutStats, getAboutValues } from "@/lib/about";
import { SectionProps } from "@/lib/header";
import { motion } from "framer-motion";
import React from "react";
export const About = ({ messages }: SectionProps) => {
  const aboutValuesData = getAboutValues(messages);
  const statsData = getAboutStats(messages);

  return (
    <section
      id="about"
      className="center flex-col! items-center w-full relative bg-[var(--neutral-0)] z-5"
    >
      <Stats data={statsData} />

      <AnimationWrapper
        as={motion.header}
        className="max-w-4xl w-full center flex-col! text-center pt-20 "
        animate={true}
        offset={-30}
      >
        <h2>{messages["about.title"]}</h2>
        <p>{messages["about.intro"]}</p>
      </AnimationWrapper>
      <div className="between flex-col! justify-center max-w-screen-xl w-full text-center px-4 lg:px-8">
        <ul className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {aboutValuesData.map((value, i) => {
            return (
              <li
                key={value.id}
                className="w-full sm:last:col-span-2 lg:last:col-span-1"
              >
                <AnimationWrapper
                  as={motion.article}
                  animate={true}
                  xOffset={20}
                  delay={0.01 * i}
                  className="center flex-col! w-full"
                >
                  <div className="center relative w-36 h-36 rounded-full border-2 border-dashed border-[var(--primary-5)] p-2">
                    <span
                      className={`center w-full h-full bg-[var(--neutral-0)] shadow-2xl rounded-full text-[var(--primary-5)]`}
                    >
                      <value.icon fontSize="large" />
                    </span>
                    <p className="center absolute -bottom-6 h-10 w-10 rounded-full bg-[var(--neutral-6)] text-[var(--text-on-primary)]! right-[10%]">
                      0{i + 1}
                    </p>
                  </div>
                  <AnimationWrapper animate={true} offset={30} delay={0.05 * i}>
                    <h3 className="text-lg font-bold mt-10">{value.title}</h3>
                    <p className="text-base!">{value.description}</p>
                  </AnimationWrapper>
                </AnimationWrapper>
              </li>
            );
          })}
        </ul>
      </div>
          <div
            className=" relative w-full mt-12 min-h-[18rem] 2xl:min-h-[25rem] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/salon.webp")' }}
          >
            <div className="overlay opacity-70"></div>
          </div>
    </section>
  );
};
