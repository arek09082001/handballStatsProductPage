function MetricCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className='rounded-2xl bg-white/8 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm'>
      <div className='text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55'>
        {title}
      </div>
      <div className='mt-2 text-2xl font-extrabold tracking-[-0.04em]'>
        {value}
      </div>
      <div className='mt-1 text-xs text-white/60'>{detail}</div>
    </div>
  );
}

export default function HeroDashboardPreview() {
  const leadTrendBarHeights = ['h-[34%]', 'h-[42%]', 'h-[39%]', 'h-[55%]', 'h-[61%]', 'h-[68%]', 'h-[66%]', 'h-[74%]', 'h-[80%]'];
  const performanceBarHeights = ['h-[18px]', 'h-[24px]', 'h-[21px]', 'h-[32px]', 'h-[29px]', 'h-[41px]', 'h-[53px]'];

  return (
    <div className='relative mx-auto w-full max-w-[500px]'>
      <div className='absolute inset-10 rounded-full bg-[#dce9ff] blur-3xl' />

      <div className='relative overflow-hidden rounded-[32px] border border-white/80 bg-linear-to-br from-white via-[#fbfdff] to-[#f3f7ff] p-4 shadow-[0_28px_70px_-34px_rgba(37,99,235,0.28)] sm:p-5'>
        <div className='flex items-center gap-2 rounded-t-[22px] border border-slate-100 bg-white px-4 py-3 shadow-[0_18px_35px_-30px_rgba(15,23,42,0.5)]'>
          <span className='size-2.5 rounded-full bg-[#ff6b6b]' />
          <span className='size-2.5 rounded-full bg-[#feca57]' />
          <span className='size-2.5 rounded-full bg-[#1dd1a1]' />
          <div className='ml-3 h-8 flex-1 rounded-full border border-slate-100 bg-slate-50' />
        </div>

        <div className='mt-4 rounded-[26px] bg-[#ffffff] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] sm:p-6'>
          <div className='rounded-[20px] bg-linear-to-br from-[#506680] via-[#3c526d] to-[#3a4f6a] p-4 shadow-[0_24px_45px_-28px_rgba(15,23,42,0.7)] sm:p-5'>
            <div className='flex items-center justify-between text-white/75'>
              <span className='text-xs font-semibold'>Marketing</span>
              <div className='flex items-center gap-1'>
                <span className='size-1 rounded-full bg-white/70' />
                <span className='size-1 rounded-full bg-white/50' />
                <span className='size-1 rounded-full bg-white/35' />
              </div>
            </div>

            <div className='mt-4 grid gap-3 sm:grid-cols-3'>
              <MetricCard
                title='Visitors'
                value='18,429'
                detail='Monthly visits'
              />
              <MetricCard
                title='Revenue'
                value='$11.20'
                detail='Per lead avg.'
              />
              <MetricCard title='Speed' value='6.47' detail='Pages / session' />
            </div>

            <div className='mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]'>
              <div className='rounded-2xl bg-white p-4 text-slate-700'>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='text-xs font-semibold text-slate-500'>
                    Leads Trend
                  </span>
                  <span className='rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500'>
                    +24%
                  </span>
                </div>
                <div className='flex h-20 items-end gap-2'>
                  {leadTrendBarHeights.map((heightClass, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t-full bg-linear-to-t from-[#b7f0dc] to-[#8be4c4] ${heightClass}`}
                    />
                  ))}
                </div>
                <div className='mt-3 flex justify-between text-[10px] text-slate-400'>
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                </div>
              </div>

              <div className='rounded-2xl bg-white p-4 text-slate-700'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-semibold text-slate-500'>
                    Performance
                  </span>
                  <span className='text-[10px] font-semibold text-slate-400'>
                    Live
                  </span>
                </div>

                <div className='mt-5 flex items-end gap-2'>
                  {performanceBarHeights.map((heightClass, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t-full bg-linear-to-t from-[#6bc4c8] to-[#8fe2db] ${heightClass}`}
                    />
                  ))}
                </div>

                <div className='mt-5 flex items-center justify-between'>
                  <div>
                    <div className='text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400'>
                      Conversion
                    </div>
                    <div className='mt-1 text-xl font-extrabold tracking-[-0.03em] text-slate-900'>
                      32%
                    </div>
                  </div>

                  <div className='relative flex size-16 items-center justify-center rounded-full bg-[conic-gradient(#506680_0_220deg,#d7e6f5_220deg_360deg)]'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-600'>
                      ROI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
