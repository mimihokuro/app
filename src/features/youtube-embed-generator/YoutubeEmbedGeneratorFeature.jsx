import React, { useState, useEffect, useCallback } from 'react';
import { FiCopy, FiCheck, FiSettings, FiEye, FiLink } from 'react-icons/fi';
import customTheme from '../../theme/index.jsx';

const { primary, secondary, colorGrayLightest, colorGray, colorGrayDark, colorWhite } = customTheme.colors;

const YoutubeEmbedGeneratorFeature = () => {
  const [inputContent, setInputContent] = useState('');
  const [videoId, setVideoId] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isShortsUrl, setIsShortsUrl] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('landscape'); // 'landscape' or 'portrait'
  const [lockRatio, setLockRatio] = useState(true);
  const [width, setWidth] = useState(560);
  const [height, setHeight] = useState(315);
  
  const [params, setParams] = useState({
    mute: true,
    rel: false,
    autoplay: false,
    loop: false,
    controls: true,
    modestbranding: true,
    enableTracking: true,
  });
  const [copied, setCopied] = useState(false);

  // Constants for ratios
  const RATIO_LANDSCAPE = 16 / 9;
  const RATIO_PORTRAIT = 9 / 16;

  // Parse Video ID, SI, and dimensions from either a URL or an iframe string
  const parseInput = (input) => {
    let targetUrl = input;
    let isShorts = false;
    let extractedWidth = null;
    let extractedHeight = null;

    // Check if input is an iframe tag
    if (input.includes('<iframe')) {
      const srcMatch = input.match(/src=["']([^"']+)["']/);
      if (srcMatch) targetUrl = srcMatch[1];

      const wMatch = input.match(/width=["'](\d+)["']/);
      const hMatch = input.match(/height=["'](\d+)["']/);
      if (wMatch) extractedWidth = parseInt(wMatch[1], 10);
      if (hMatch) extractedHeight = parseInt(hMatch[1], 10);
    }

    if (targetUrl.includes('youtube.com/shorts/')) {
      isShorts = true;
    }

    const idRegExpString = "(?:youtube\\.com\\/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\\.be/|youtube\\.com/shorts/)([a-zA-Z0-9_-]{11})";
    const idRegExp = new RegExp(idRegExpString);
    const idMatch = targetUrl.match(idRegExp);
    const id = idMatch ? idMatch[1] : '';
    
    const siMatch = targetUrl.match(/[?&]si=([^&"']+)/);
    const si = siMatch ? siMatch[1] : '';

    return { id, si, isShorts, width: extractedWidth, height: extractedHeight };
  };

  useEffect(() => {
    const { id, si, isShorts, width: exW, height: exH } = parseInput(inputContent);
    if (id) setVideoId(id);
    if (si) setTrackingId(si);
    setIsShortsUrl(isShorts);

    if (exW && exH) {
      setWidth(exW);
      setHeight(exH);
      setAspectRatio(exW > exH ? 'landscape' : 'portrait');
    } else if (isShorts) {
      setAspectRatio('portrait');
      setWidth(315);
      setHeight(560);
    } else if (id && !inputContent.includes('<iframe')) {
      setAspectRatio('landscape');
      setWidth(560);
      setHeight(315);
    }
  }, [inputContent]);

  const toggleParam = (key) => {
    setParams(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWidthChange = (val) => {
    const newWidth = parseInt(val, 10) || 0;
    setWidth(newWidth);
    if (lockRatio) {
      const ratio = aspectRatio === 'landscape' ? RATIO_LANDSCAPE : RATIO_PORTRAIT;
      setHeight(Math.round(newWidth / ratio));
    }
  };

  const handleHeightChange = (val) => {
    const newHeight = parseInt(val, 10) || 0;
    setHeight(newHeight);
    if (lockRatio) {
      const ratio = aspectRatio === 'landscape' ? RATIO_LANDSCAPE : RATIO_PORTRAIT;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const setPreset = (w, h, type) => {
    setAspectRatio(type);
    setWidth(w);
    setHeight(h);
  };

  const generateEmbedUrl = useCallback(() => {
    if (!videoId) return '';
    let baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const queryParts = [];

    if (params.autoplay) queryParts.push('autoplay=1');
    if (params.mute) queryParts.push('mute=1');
    if (params.rel === false) queryParts.push('rel=0');
    if (params.controls === false) queryParts.push('controls=0');
    if (params.modestbranding) queryParts.push('modestbranding=1');
    if (params.loop) {
      queryParts.push('loop=1');
      queryParts.push(`playlist=${videoId}`);
    }
    
    if (params.enableTracking && trackingId) {
      queryParts.push(`si=${trackingId}`);
    }

    return queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;
  }, [videoId, params, trackingId]);

  const embedCode = videoId 
    ? `<iframe width="${width}" height="${height}" src="${generateEmbedUrl()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    : '';

  const copyToClipboard = () => {
    if (!embedCode) return;
    const el = document.createElement('textarea');
    el.value = embedCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input and Settings */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiEye size={20} color={primary} />
                Step 1: 入力
              </h2>
              <textarea
                rows={3}
                placeholder="YouTube URL または <iframe>コード"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:outline-none transition-all text-sm font-mono"
                style={{ '--tw-ring-color': primary }}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
              />
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FiSettings size={20} color={primary} />
                Step 2: 表示設定
              </h2>
              
              <div className="space-y-6">
                {/* Size Controls */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">サイズ (px)</label>
                    <button 
                      onClick={() => setLockRatio(!lockRatio)}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md transition-all"
                      style={{ 
                        backgroundColor: lockRatio ? colorGrayLightest : 'transparent',
                        color: lockRatio ? primary : colorGrayDark
                      }}
                    >
                      {lockRatio ? <FiLink size={12} /> : <FiLink size={12} opacity={0.5} />}
                      {lockRatio ? '比率を固定中' : '比率固定なし'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 ml-1">幅 (Width)</span>
                      <input 
                        type="number" 
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:outline-none"
                        style={{ '--tw-ring-color': primary }}
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 ml-1">高さ (Height)</span>
                      <input 
                        type="number" 
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:outline-none"
                        style={{ '--tw-ring-color': primary }}
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Presets */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => setPreset(560, 315, 'landscape')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">560x315</button>
                    <button onClick={() => setPreset(1280, 720, 'landscape')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">720p</button>
                    <button onClick={() => setPreset(315, 560, 'portrait')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">Shorts</button>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">パラメータ</label>
                  <ToggleItem label="計測用IDを保持 (si=)" checked={params.enableTracking} onChange={() => toggleParam('enableTracking')} />
                  <ToggleItem label="ミュート (mute=1)" checked={params.mute} onChange={() => toggleParam('mute')} />
                  <ToggleItem label="関連動画を限定 (rel=0)" checked={!params.rel} onChange={() => toggleParam('rel')} />
                  <ToggleItem label="自動再生 (autoplay=1)" checked={params.autoplay} onChange={() => toggleParam('autoplay')} />
                  <ToggleItem label="ループ再生 (loop=1)" checked={params.loop} onChange={() => toggleParam('loop')} />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Preview and Output */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiEye size={20} color={primary} />
                プレビュー
              </h2>
              <div className="bg-slate-100 rounded-xl p-4 flex justify-center items-start min-h-[400px] overflow-auto border border-slate-200 border-dashed">
                {videoId ? (
                  <div 
                    className="relative shadow-2xl transition-all duration-300 ease-in-out bg-black rounded-lg overflow-hidden shrink-0"
                    style={{ 
                      width: `${width}px`,
                      maxWidth: '100%',
                      aspectRatio: !lockRatio ? `${width}/${height}` : undefined,
                      height: !lockRatio ? 'auto' : `${height}px`
                    }}
                  >
                    <iframe
                      key={`${generateEmbedUrl()}-${width}-${height}`}
                      className="w-full h-full border-0"
                      src={generateEmbedUrl()}
                      title="YouTube video player preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="self-center text-slate-400 text-center">
                    <FiEye size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm italic font-medium">動画を読み込んでください</p>
                  </div>
                )}
              </div>
              {videoId && (
                <div className="mt-3 flex justify-center text-[10px] text-slate-400 gap-4">
                  <span>Width: {width}px</span>
                  <span>Height: {height}px</span>
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiCopy size={20} color={primary} />
                  生成コード
                </h2>
                <button
                  onClick={copyToClipboard}
                  disabled={!embedCode}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: copied ? secondary : primary, 
                    color: colorWhite,
                    opacity: !embedCode ? 0.3 : 1
                  }}
                >
                  {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  {copied ? 'コピー完了' : 'コードをコピー'}
                </button>
              </div>
              <pre className="p-5 bg-slate-900 text-blue-300 rounded-2xl overflow-x-auto text-[11px] md:text-xs font-mono leading-relaxed min-h-[100px] whitespace-pre-wrap break-all border border-slate-800">
                {embedCode || '// 入力後にコードが表示されます'}
              </pre>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onChange}>
    <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{label}</div>
    <div 
      className="w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out shrink-0"
      style={{ backgroundColor: checked ? customTheme.colors.primary : customTheme.colors.colorGray }}
    >
      <div 
        className={`absolute top-1 w-3 h-3 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${checked ? 'left-6' : 'left-1'}`}
        style={{ backgroundColor: customTheme.colors.colorWhite }}
      />
    </div>
  </div>
);

export default YoutubeEmbedGeneratorFeature;
